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
                        console.error(error);
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
            console.error(error);
            errores.existenErrores = true;
            errores.mensaje = 'Ha ocurrido un error al crear el caso';
        }

        if (errores.existenErrores) {
            res.sendStatus(400);
        } else {
            res.sendStatus(200);
        }
    }

    public async getCasosMapa (req: Request, res: Response) {
      try {
        console.log('getCasosMapa')
        let ret = [];
        let hoy = new Date();

        let l = await CasosService.rellenaCasosMapa ("S", await CasosService.getListaSospechosos(hoy));
        if (l && l.length>0) {
          ret = ret.concat(l);
        }
        l = await CasosService.rellenaCasosMapa ("C", await CasosService.getListaConfirmados(hoy));
        if (l && l.length>0) {
          ret = ret.concat(l);
        }
        l = await CasosService.rellenaCasosMapa ("A", await CasosService.getListaActivos(hoy));
        if (l && l.length>0) {
          ret = ret.concat(l);
        }
        l = await CasosService.rellenaCasosMapa ("R", await CasosService.getListaFinal(hoy, 'R'));
        if (l && l.length>0) {
          ret = ret.concat(l);
        }
        l = await CasosService.rellenaCasosMapa ("D", await CasosService.getListaFinal(hoy, 'D'));
        if (l && l.length>0) {
          ret = ret.concat(l);
        }
        res.status(200).send(ret);
      } catch (error) {
          console.error(error);
          res.sendStatus(400);
      }
    }

    public async getResumen (req: Request, res: Response) {
      console.log('getResumen')
        try {
          let ret = {
            sospechosos: {value:0, percent:0, estado:0 }, //estado= 0: el mismo, 1: sube, -1: baja
            confirmados: {value:0, percent:0, estado:0 },
            activos: {value:0, percent:0, estado:0 },
            recuperados: {value:0, percent:0, estado:0 },
            decesos: {value:0, percent:0, estado:0 }
          };

          let hoy = new Date();
          let ayer = new Date();
          ayer.setDate(hoy.getDate() - 1);

          let resultadohoy = await CasosService.getResumenSospechosos(hoy);
          let resultadoayer = await CasosService.getResumenSospechosos(ayer);
          ret.sospechosos.value = resultadohoy;
          ret.sospechosos.percent = ((resultadohoy-resultadoayer)*100)/resultadohoy;
          ret.sospechosos.estado = (resultadohoy>resultadoayer?1:(resultadohoy<resultadoayer?-1:0));

          resultadohoy = await CasosService.getResumenConfirmados(hoy);
          resultadoayer = await CasosService.getResumenConfirmados(ayer);
          ret.confirmados.value = resultadohoy;
          ret.confirmados.percent = ((resultadohoy-resultadoayer)*100)/resultadohoy;
          ret.confirmados.estado = (resultadohoy>resultadoayer?1:(resultadohoy<resultadoayer?-1:0));

          resultadohoy = await CasosService.getResumenActivos(hoy);
          resultadoayer = await CasosService.getResumenActivos(ayer);
          ret.activos.value = resultadohoy;
          ret.activos.percent = ((resultadohoy-resultadoayer)*100)/resultadohoy;
          ret.activos.estado = (resultadohoy>resultadoayer?1:(resultadohoy<resultadoayer?-1:0));

          resultadohoy = await CasosService.getResumenFinal(hoy, 'R');
          resultadoayer = await CasosService.getResumenFinal(ayer, 'R');
          ret.recuperados.value = resultadohoy;
          ret.recuperados.percent = ((resultadohoy-resultadoayer)*100)/resultadohoy;
          ret.recuperados.estado = (resultadohoy>resultadoayer?1:(resultadohoy<resultadoayer?-1:0));

          resultadohoy = await CasosService.getResumenFinal(hoy, 'D');
          resultadoayer = await CasosService.getResumenFinal(ayer, 'D');
          ret.decesos.value = resultadohoy;
          ret.decesos.percent = ((resultadohoy-resultadoayer)*100)/resultadohoy;
          ret.decesos.estado = (resultadohoy>resultadoayer?1:(resultadohoy<resultadoayer?-1:0));

          res.status(200).send(ret);
        } catch (error) {
            console.error(error);
            res.sendStatus(400);
        }
    }

    public async getEstadisticas (req: Request, res: Response) {
      console.log('getEstadisticas')
      try {
        let fecha = new Date();
        fecha.setDate(fecha.getDate() - 6); //desde hace 7 días

        let ret = {
          sospechosos: [],
          confirmados: [],
          activos: [],
          recuperados: [],
          decesos: []
        };

        for (let i=1;i<=7;i++) {
          let resultado = await CasosService.getResumenSospechosos(fecha);
          ret.sospechosos.push(resultado);
          resultado = await CasosService.getResumenConfirmados(fecha);
          ret.confirmados.push(resultado);
          resultado = await CasosService.getResumenActivos(fecha);
          ret.activos.push(resultado);
          resultado = await CasosService.getResumenFinal(fecha, 'R');
          ret.recuperados.push(resultado);
          resultado = await CasosService.getResumenFinal(fecha, 'D');
          ret.decesos.push(resultado);

          fecha.setDate(fecha.getDate() + 1);
        }

        res.status(200).send(ret);
      } catch (error) {
          console.error(error);
          res.sendStatus(400);
      }
    }

    private static async getListaSospechosos(fecha) {
      let casos = await getConnection().createQueryBuilder()
          .select("cxe.idcaso")
          .from(Casosxestados, "cxe")
          .where("cxe.estado in (:...estados) and cxe.fecha::date <= :fecha", { estados: ['PC', 'CO', 'PT', 'PR'], fecha: fecha })
          .groupBy("cxe.idcaso")
          .execute();

      if (casos) {
        return casos;
      } else {
        return null;
      }
    }

    private static async getResumenSospechosos(fecha) {
      let casos = await CasosService.getListaSospechosos(fecha);
      if (casos) {
        return casos.length;
      } else {
        return 0;
      }
    }

    private static async getListaConfirmados(fecha) {
      let casos = await getConnection().createQueryBuilder()
          .select("cxe.idcaso")
          .from(Casosxestados, "cxe")
          .innerJoin("cxe.caso", "casos")
          .where("cxe.estado in (:...estados) and cxe.fecha::date <= :fecha and casos.resultadotest = :resultadotest", { estados: ['PE'], fecha: fecha, resultadotest: 'P' })
          .groupBy("cxe.idcaso")
          .execute();

      if (casos) {
        return casos;
      } else {
        return null;
      }
    }

    private static async getResumenConfirmados(fecha) {
      let casos = await CasosService.getListaConfirmados(fecha);
      if (casos) {
        return casos.length;
      } else {
        return 0;
      }
    }

    private static async getListaActivos(fecha) {
      let casos = await getConnection().createQueryBuilder()
          .select("cxe.idcaso")
          .from(Casosxestados, "cxe")
          .where("cxe.estado in (:...estados) and cxe.fecha::date <= :fecha", { estados: ['PE'], fecha: fecha })
          .groupBy("cxe.idcaso")
          .execute();

      if (casos) {
        return casos;
      } else {
        return null;
      }
    }

    private static async getResumenActivos(fecha) {
      let casos = await CasosService.getListaActivos(fecha);
      if (casos) {
        return casos.length;
      } else {
        return 0;
      }
    }

    //resultado 'R' o 'D'
    private static async getListaFinal(fecha, resultado) {
      let casos = await getConnection().createQueryBuilder()
          .select("cxe.idcaso")
          .from(Casosxestados, "cxe")
          .innerJoin("cxe.caso", "casos")
          .where("cxe.estado in (:...estados) and cxe.fecha::date <= :fecha " +
              "and casos.resultadotest = :resultadotest " +
              "and casos.resultado = :resultado ",
              { estados: ['FI'], fecha: fecha, resultadotest: 'P', resultado: resultado })
          .groupBy("cxe.idcaso")
          .execute();

        if (casos) {
          return casos;
        } else {
          return null;
        }
    }

    private static async getResumenFinal(fecha, resultado) {
      let casos = await CasosService.getListaFinal(fecha, resultado);
      if (casos) {
        return casos.length;
      } else {
        return 0;
      }
    }

    ////////////////////////////////
    private static async getListaCasos(ids, tipo) {
      let casos = await getConnection().createQueryBuilder()
          .select("c.lat", "lat")
          .addSelect("c.lng", "lng")
          .addSelect("'"+ tipo + "'", "tipo")
          .from(Casos, "c")
          .where("c.id in (:...ids)", { ids: ids})
          .execute();

      if (casos) {
        return casos;
      } else {
        return null;
      }
    }

    private static async rellenaCasosMapa (tipo, lista) {
      if (lista && lista.length>0) {
        //Recuperamos los casos, pero sólo los valores que nos interesan (lat, lng)
        let arr = [];
        for (let i in lista) {
          arr.push(lista[i].idcaso);
        }

        return await CasosService.getListaCasos(arr, tipo);
      }
    }

}
