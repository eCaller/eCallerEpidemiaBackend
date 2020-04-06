/**
 * Copyright 2020, Ingenia, S.A.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * @author jamartin@ingenia.es
 */
import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { Preguntas } from '../models/preguntas';
import { Respuestas } from '../models/respuestas';
import { Casospositivos } from '../models/casospositivos';
import { Casospositivosxrespuestas } from '../models/casospositivosxrespuestas';
import { Casosxrespuestas } from '../models/casosxrespuestas';

export class PreguntaService {
    public async findAllPreguntas (req: Request, res: Response) {
        try {
            console.log("findAllPreguntas");
            let entity = await getConnection().getRepository(Preguntas).find({relations: ['respuestas'], order: {orden: "ASC"}});
            for (let i in entity) {
              if (entity[i].respuestas && entity[i].respuestas.length>0) {
                entity[i].respuestas.sort((a, b) => {
                  if (a.orden > b.orden) {return 1;}
                  if (a.orden < b.orden) {return -1;}
                  // igual
                  return 0;
                });
              }
            }

            res.send(entity);
        } catch (error) {
            res.sendStatus(500);
        }

    }

    /**
      Recupera las preguntas y respuestas de un caso a partir de su id
    */
    public async findTriagecaso (req: Request, res: Response) {
        console.log('findTriagecaso');
        console.log(req.params.tagId);

        let ret = {
            success: false,
            data: null,
            message: null
        };

        let id = req.params.tagId;

        try {
          let triage = await getConnection().createQueryBuilder()
              .select("p.id", "idpregunta")
              .addSelect("p.pregunta", "pregunta")
              .addSelect("r.id", "idrespuesta")
              .addSelect("r.respuesta", "respuesta")
              .from(Casosxrespuestas, "cxr")
              .innerJoin("cxr.respuestas", "r")
              .innerJoin("r.pregunta", "p")
              .where("cxr.idcaso = :id", { id: id })
              .orderBy("p.orden", "ASC")
              .addOrderBy("r.orden", "ASC")
              .execute();

          ret.success = true;
          ret.message = null;
          ret.data = triage;

          console.log(ret)
          res.status(200).send(ret);
        } catch (error) {
          console.error(error);
          ret.success = false;
          ret.message = error;
          res.status(400).send(ret);
        }
    }

    public async comprobarTriage(req: Request, res: Response) {
        try {
            let isPositivo = false;

            // Recuperamos las respuestas del usuario
            let preguntrasRespondidas: Preguntas[] = req.body;

            // Recuperamos los posibles casos positivos y los mapeamos solo a su ID
            let casosPositivos = await getConnection().getRepository(Casospositivos).find({relations: ['respuestas']});
            let casosMapeados = PreguntaService.mapearCasosPositivos(casosPositivos);

            /**
             * La idea es, recorrer cada posible positivo y ver si las respuestas
             * que cumplen el criteria de que sea un positivo están activas.
             * casoMapeado contiene un array con las ids de las respuestas positivas
             * necesaria para ese caso, ejemplo:
             * casoMapeado = [3, 5 , 7]
             * Para el ejemplo expuesto, se trataría de un positivo, si las respuestas 3, 5 y 7 se
             * han constestado de forma positiva
             */
            for (let casoMapeado of casosMapeados) {
                // Cantidad de veces que se ha encontrado una respuesta positiva
                // para este caso
                let matches = 0;
                for (let pregunta of preguntrasRespondidas) {

                    if (pregunta.tipo.toUpperCase() === 'R') {
                        // En las pregunta de tipo R, value contendrá el id de la respuesta
                        // que se ha seleccionado
                        if (pregunta.value != undefined && casoMapeado.includes(Number(pregunta.value))) {
                            // Hemos encontrado una pregunta con una respuesta para este caso positivo
                            matches++;
                        }
                    } else if (pregunta.tipo.toUpperCase() === 'C') {
                        // Para las preguntas de tipo C, el si una respuesta es positiva o no,
                        // se encuentra dentor de la respuesta y no de la pregunta en el valor valor
                        // y será de tipo booleano
                        for (let respuesta of pregunta.respuestas) {
                            if (respuesta.valor != undefined && respuesta.valor === true && casoMapeado.includes(respuesta.id)) {
                                // Hemos encontrado una respuesta con un valor positivo que su id
                                // se encuentra en la lista de casos positivos
                                matches++;
                            }
                        }
                    } else {
                        console.log('Tipo de pregunta incorrecto.')
                        // No debería de llegar aquí, si lo hace, lanzamos un error
                        throw new Error('Tipo de pregunta incorrecto.');
                    }
                }

                // Vamos a comprobar si hemos encontrado todas las respuestas para este
                // caso de positivos activas
                if (matches >= casoMapeado.length) {
                    isPositivo = true;
                    // Dejamos de buscar más
                    break;
                }
            }
            res.status(200).send(isPositivo);
        } catch (error) {
            res.status(500).send('Ha ocurrido un error al comprobar el triage.');
        }
    }

    private static mapearCasosPositivos(casosPositivos: Casospositivos[]):number[][] {
        let casosMapeados:number[][] = []
        for (let casoPositivo of casosPositivos) {
            if (casoPositivo.respuestas.length > 0) {
                let respuestasMaped = casoPositivo.respuestas.map((r) => {
                    return r.id
                });
                casosMapeados.push(respuestasMaped)
            }
        }
        return casosMapeados;
    }

    public async savetriage(req: Request, res: Response) {
        try {
            let response = req.body;

            let preguntas = response.triage;
            let casospositivos = response.casospositivos;

            //console.log(casospositivos);

            //Primero borramos las respuestas que no se encuentren en la bbdd
            //Recuperamos las respuestas de la BBDD
            let lr = await getConnection().getRepository(Respuestas).find({order: {id: "ASC"}});
            let lrep = PreguntaService.extraeRespuestas(preguntas);
            if (lr && lrep && lrep.length>0) {
              for (let i in lr) {
                if (!lrep.find(item=>item.id===lr[i].id)) {
                  await getConnection().getRepository(Respuestas).delete(lr[i]);
                }
              }
            }

            //Lo mismo con las preguntas
            let lp = await getConnection().getRepository(Preguntas).find({order: {id: "ASC"}});
            for (let h in lp) {
              if (!preguntas.find(item => item.id===lp[h].id)) {
                await getConnection().getRepository(Preguntas).delete(lp[h]);
              }
            }

            //Insertamos las preguntas con sus respuestas
            let cod= "A";
            for (let i in preguntas) {
              //Actualizamos el código para que todos sean correlativos
              preguntas[i].codigo = cod;
              let c = cod.charCodeAt(0);
              cod= String.fromCharCode(++c);
              //

              //Guardamos. Si id = null se inserta y si no se actualiza
              await getConnection().getRepository(Preguntas).save(preguntas[i]);
              //y recuperamos el id
              console.log('nuevo id: ' + preguntas[i].id);

              //recorremos las respuestas
              let codresp = 1;
              for (let j in preguntas[i].respuestas) {
                //guardamos. si el id de la respuesta ya está en bbdd

                //Actualizamos el código para que todos sean correlativos
                preguntas[i].respuestas[j].codigo = codresp;
                codresp+=1;

                if (!preguntas[i].respuestas[j].pregunta) { //En caso de ser una respuesta nueva
                  preguntas[i].respuestas[j].pregunta = preguntas[i];
                }
                //Si está lo actualiza y si no lo inserta
                await getConnection().getRepository(Respuestas).save(preguntas[i].respuestas[j]);

              }

            }

            //Actualizamos los casospositivos

            //Borramos primero las confirmaciones que no existan
            let lc = await getConnection().getRepository(Casospositivos).find({order: {id: "ASC"}});
            if (lc && casospositivos) {
              for (let i in lc) {
                if (!casospositivos.find(item => item.id===lc[i].id)) {
                  //Borramos las respuestas
                  await getConnection().createQueryBuilder().delete().from(Casospositivosxrespuestas)
                    .where("idcasopositivo = :idcasopositivo", { idcasopositivo: lc[i].id}).execute();

                  //borramos el padre
                  await getConnection().createQueryBuilder().delete().from(Casospositivos).where("id = :id", { id: lc[i].id }).execute();
                }
              }
            }

            //añadimos las nuevas confirmaciones
            for (let i in casospositivos) {
              //insertamos si no está
              let cc = await getConnection().getRepository(Casospositivos).find({where: {id: casospositivos[i].id},order: {id: "ASC"}});
              let idcasospositivos = null;
              if (!casospositivos[i].id || !cc || cc.length<=0) {
                let insertResult = await getConnection().createQueryBuilder().insert().into(Casospositivos).values({id: casospositivos[i].id}).execute();
                idcasospositivos = insertResult.identifiers[0].id;
                console.log('nuevo idcasospositivos: ' + idcasospositivos);
              } else {
                idcasospositivos = casospositivos[i].id;
              }

              //actualizamos la tabla Casospositivosxrespuestas con las respuestas
              let lr = await getConnection()
                .createQueryBuilder()
                .select("cxr")
                .from(Casospositivosxrespuestas, "cxr")
                .innerJoinAndSelect("cxr.respuestas", "respuestas")
                .where("cxr.idcasopositivo = :id", { id: idcasospositivos })
                .orderBy("cxr.id")
                .execute();

              //console.log(lr);
              for (let j in lr) {
                //primero borramos las que no estén en casospositivos y si en lr
                if (!casospositivos[i].respuestas.find(item => item.id === lr[j].cxr_idrespuesta)) {
                  await getConnection().createQueryBuilder().delete().from(Casospositivosxrespuestas)
                    .where("idcasopositivo = :idcasopositivo and idrespuesta = :idrespuesta", { idcasopositivo: idcasospositivos, idrespuesta: lr[j].cxr_idrespuesta}).execute();
                }

              }

              //y despues insertamos las que estén en casospositivos y no estén en lr
              for (let h in casospositivos[i].respuestas) {
                if (!lr.find(item => item.cxr_idrespuesta === casospositivos[i].respuestas[h].id)) {
                  let nuevo = {id:null, casospositivos:casospositivos[i], respuestas:casospositivos[i].respuestas[h]}
                  await getConnection().createQueryBuilder().insert().into(Casospositivosxrespuestas).values(nuevo).execute();
                }
              }

            }

            console.log('triage saved');
            //console.log(response);
            res.sendStatus(200);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }

    }

    private static extraeRespuestas(preguntas) {
      let lresp = []
      if (preguntas) {
        for (let i in preguntas) {
          if (preguntas[i].respuestas) {
            for (let j in preguntas[i].respuestas) {
              lresp.push(preguntas[i].respuestas[j]);
            }
          }
        }
      }
      return lresp;
    }

    /**
     * Método que devolverá un array conteniendo todos
     * los ids de las respuestas que han sido contestadas
     * a partir de un array de preguntas
     * @param preguntas preguntas contestadas
     */
    public static extraerIdRespuestasContestadas(preguntas: Preguntas[]): number[] {
      let ids: number[] = [];
      for (let pregunta of preguntas) {
        if (pregunta.tipo.toUpperCase() === 'R') {
          // Para tipo R -> pregunta.value === contestación. Puede ser undefined o el id de la respuesta
          // que puede ser negativa o positiva
          if (pregunta.value != undefined) {
            // Guardamos el id de la pregunta
            ids.push(pregunta.value);
          }
        } else if (pregunta.tipo.toUpperCase() === 'C') {
          // Para tipo C -> pregunta.respuesta.valor === contestación. Pueder ser undefined o true si es positivo o false si no
          for (let respuesta of pregunta.respuestas) {
            if (respuesta.valor != undefined && respuesta.valor === true) {
              // Almacenamos la id ya sea positiva o negativa la respuesta, mientras haya contestado
              ids.push(respuesta.id);
            }
          }
        } else {
          console.log('Pregunta sin un tipo correcto.')
        }
      }
      return ids;
    }

}
