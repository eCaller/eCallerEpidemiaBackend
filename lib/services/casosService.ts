import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { Casos } from '../models/casos'
import { Casosxestados } from '../models/casosxestados';
import { Preguntas } from '../models/preguntas';
import { PreguntaService } from './preguntaService';
import { Respuestas } from '../models/respuestas';
import { Casosxrespuestas } from '../models/casosxrespuestas';

export class CasosService {
    public async crearCaso (req: Request, res: Response) {
        let errores = {
            existenErrores: false,
            mensaje: ''
        }
        try {
            console.log('creando Caso')
            let entities = req.body;
            if (entities.caso != undefined && entities.preguntas != undefined) {
                let caso: Casos = entities.caso;
                let preguntas: Preguntas[] = entities.preguntas;
                // Vamos a comprar si se han introducido los valores requeridos
                if ((caso.nombre == null || caso.nombre == '') || (caso.dni == null || caso.dni == '') ||
                    (caso.telefono == null || caso.telefono == '') ||(caso.direccion == null || caso.direccion == '')) {
                    
                    // Avisamos del error
                    errores.existenErrores = true;
                    errores.mensaje = 'No se han rellenado todos los campos necesarios'
                } else {
                    // Vamos a recuperar el último código para aplicar al caso el nuevo                    
                    // Aquí almacenaremos el código final
                    let codigo = '';
                    try {
                        // Devuelve undefined si no encuentra un resultado y solo debería de pasar
                        // la primera vez que creamos un caso en el sistema
                        let ultimoCaso = await getConnection().createQueryBuilder(Casos, 'casos')
                            .select('casos.codigo')
                            .orderBy('casos.codigo', 'DESC')
                            .limit(1)
                            .getOne();
                        
                        // Seleccionamos el año actual
                        let yearActual: any = new Date().getFullYear();
                        let yearSplited = yearActual.toString().split('')
                        let yearDosDigitos = yearSplited[2] + '' + yearSplited[3];                    

                        // No existe un caso aún
                        if (ultimoCaso == undefined) {
                            codigo = '0000000/' + yearDosDigitos
                        } else {
                            // Si ya hay un código y si el año es el mismo, solo debemos
                            // incrementar la parte izquierda, si no, debemos cambiar también el año
                            // ya que puede ser que cambiemos de año y debamos reiniciar la cuenta
                            let codigoSplited = ultimoCaso.codigo.split('/');
                            let parteNumerica = Number(codigoSplited[0]);
                            let parteYear = codigoSplited[1]; // String
                            
                            // Vamos a empezar por el año, ya que si es distinto, le agregamos todo
                            // a 0 directamente
                            if (parteYear !== yearDosDigitos) {
                                // Le asignamos el primer codigo del año
                                codigo = '0000000/' + yearDosDigitos
                            } else {
                                // Si el año es el mismo, incrementamos solo el codigo
                                parteNumerica++;
                                codigo = parteNumerica.toString();

                                // Calculamos los 0 faltantes
                                let cerosFaltantes = '0000000'.length - codigo.length;
                                while (cerosFaltantes > 0) {
                                    codigo = '0' + codigo;
                                    cerosFaltantes--;
                                }

                                // Y le agregamos el año
                                codigo = codigo + '/' + parteYear;
                            }
                        }

                        // Asignamos el código generado al caso
                        caso.codigo = codigo;
                    } catch (error) {
                        console.log(error);
                        errores.existenErrores = true;
                        errores.mensaje = 'Ha ocurrido un error al crear el caso';
                    }

                    // Creamos el caso
                    let newCaso: Casos = new Casos();
                    newCaso.codigo = caso.codigo;
                    newCaso.direccion = caso.direccion;
                    newCaso.dni = caso.dni;
                    newCaso.nombre = caso.nombre;
                    newCaso.estado = 'PC';
                    newCaso.telefono = caso.telefono;
                    newCaso.fecha = caso.fecha;
                    newCaso.lat = caso.lat;
                    newCaso.lng = caso.lng;
                    newCaso.edad = caso.edad || 0;
                    newCaso.email = caso.email || '';
                    newCaso.observaciones = caso.observaciones || '';
                    newCaso = await getConnection().manager.save(newCaso);                    
                    
                    // Creamos el caso por estado
                    let newCasoXEstado: Casosxestados = new Casosxestados();
                    newCasoXEstado.estado = 'PC';
                    newCasoXEstado.fecha = caso.fecha;
                    newCasoXEstado.caso = newCaso;
                    newCasoXEstado = await getConnection().manager.save(newCasoXEstado);

                    // Ahora que tenemos creado el caso, vamos a asociar las respuestas positivas
                    // con el caso 
                    let respuestasIds: number[] = [];
                    //Las preguntas pueden ser de tipo R o C
                    respuestasIds = PreguntaService.extraerIdRespuestasContestadas(preguntas);

                    // Ahora que tenemos las respuestas, vamos a asociarlas al caso
                    let respuestasBBDD: Respuestas[] = await getConnection().getRepository(Respuestas).findByIds(respuestasIds);

                    let casosxrespuestas: Casosxrespuestas[] = [];
                    for (let respuestaBBDD of respuestasBBDD) {
                        let casoxrespuesta = new Casosxrespuestas();
                        casoxrespuesta.respuestas = respuestaBBDD;
                        casoxrespuesta.casos = newCaso;
                        casosxrespuestas.push(casoxrespuesta);
                    }                     
                    await getConnection().createQueryBuilder().insert().into(Casosxrespuestas).values(casosxrespuestas).execute();            

                }
            } else {
                errores.existenErrores = true;
                errores.mensaje = 'No se ha encontrado el caso o las preguntas';
            }
        } catch (error) {
            console.log(error);
            errores.existenErrores = true;
            errores.mensaje = 'Ha ocurrido un error al crear el caso';
        }

        if (errores.existenErrores) {
            res.sendStatus(400);
        } else {
            res.sendStatus(200);
        }
    }

}
