import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { Preguntas } from '../models/preguntas'
import { Respuestas } from '../models/respuestas';

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

            res.send(entity)
        } catch (error) {
            res.sendStatus(500);
        }

    }

    public async realizarTest(req: Request, res: Response) {
        try {
            let preguntrasRespondidas: Preguntas[] = req.body;
            console.log('realizarTest');
            console.log(preguntrasRespondidas);

            let respuestasConCasos = await getConnection().getRepository(Respuestas).find();
            console.log(respuestasConCasos);
            /*if (preguntrasRespondidas != null) {
                for (let i = 0; i < preguntrasRespondidas.length; i++) {
                    console.log(preguntrasRespondidas[i]);
                    let pregunta = preguntrasRespondidas[i];
                    switch (pregunta.tipo.toUpperCase()) {
                        case 'R': //comprobar tipo r
                            break;
                        case 'C': // Comprobar tipo C
                            break;

                    }
                }
            }*/


        } catch (error) {
            console.log(error);
        }
        res.sendStatus(200);
    }

    public async savetriage(req: Request, res: Response) {
        try {
            let response = req.body;

            let preguntas = response.triage;
            let casospositivos = response.casospositivos;

            for (let i in preguntas) {
              //Guardamos. Si id = null se inserta y si no se actualiza
              await getConnection().getRepository(Preguntas).save(preguntas[i]);
              //y recuperamos el id
              console.log('nuevo id: ' + preguntas[i].id)

              //recorremos las respuestas
              for (let j in preguntas[i].respuestas) {
                //guardamos. si el id de la respuesta ya está en bbdd
                if (!preguntas[i].respuestas[j].pregunta) { //En caso de ser una respuesta nueva
                  preguntas[i].respuestas[j].pregunta = preguntas[i];
                }
                //Si está lo actualiza y si no lo inserta
                await getConnection().getRepository(Respuestas).save(preguntas[i].respuestas[j]);

              }

            }

            //Recuperamos el pregunta de bbdd
            let ls = await getConnection().getRepository(Preguntas).find({relations: ['respuestas'], order: {orden: "ASC"}});
            for (let h in ls) {
              if (!preguntas.find(item => item.id===ls[h].id)) {
                await getConnection().getRepository(Preguntas).delete(ls[h]);
              }
            }

            //por cada registro, si no existe en pregunta, lo Borramos

            //hacemos lo mismo con las respuestas


            //Actulizamos los casospositivos

            console.log('savetriage');
            console.log(response);
            res.sendStatus(200);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }

    }
}
