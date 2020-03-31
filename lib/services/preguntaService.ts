import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { Preguntas } from '../models/preguntas'
import { Casospositivos } from '../models/casospositivos';

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
            let response = JSON.stringify(req.body);
            console.log('savetriage');
            console.log(response);
        } catch (error) {
            console.log(error);
        }
        res.sendStatus(200);
    }
}
