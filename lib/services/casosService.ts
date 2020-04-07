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
import { getConnection, In, Like } from 'typeorm';
import { Casos } from '../models/casos'
import { Casosxestados } from '../models/casosxestados';
import { Preguntas } from '../models/preguntas';
import { PreguntaService } from './preguntaService';
import { Respuestas } from '../models/respuestas';
import { Casosxrespuestas } from '../models/casosxrespuestas';
import { Citas } from '../models/citas';

import { Listados } from '../models/listados';
import { ILike } from '../utils/ILike';

export class CasosService {

    public async findCasos(req: Request, res: Response) {
      console.log('findCasos');
      console.log(req.query);

      //Filtro estados
      let filtroestado = {estado: In(['PC', 'CO'])};
      if (req.query.estados) {
        if (req.query.estados === "cita") {
          filtroestado = {estado: In(['PC', 'CO'])};
        } else if (req.query.estados === "fisica") {
          filtroestado = {estado: In(['PT', 'PR'])};
        } else if (req.query.estados === "evolucion") {
          filtroestado = {estado: In(['PE', 'FI'])};
        }
      }

      //Filtro genérico
      let filtro = [];
      if (req.query.filter && req.query.filter.length>0) {
        let f = "%" + req.query.filter + "%";

        let filtronombre = Object.assign({}, filtroestado);
        filtronombre["nombre"] = ILike(f);
        filtro.push(filtronombre);

        let filtrocod = Object.assign({}, filtroestado);
        filtrocod["codigo"] = ILike(f);
        filtro.push(filtrocod);

        let filtrodir = Object.assign({}, filtroestado);
        filtrodir["direccion"] = ILike(f);
        filtro.push(filtrodir);

      } else {
        filtro.push(filtroestado);
      }

      //Orden
      let orden = {};
      if (req.query.sort) {
        let or = req.query.sort.split("|");
        orden[or[0]] = or[1].toUpperCase();
      }

      //Paginación
      let pagina=(req.query.page?req.query.page:1)-1;
      let filas= (req.query.per_page?req.query.per_page:10);
      pagina=pagina * filas;

      try {
        //Consulta
        let [list, count] = await getConnection().getRepository(Casos).findAndCount({
                    where: filtro,
                    order: orden,
                    take: filas,
                    skip: pagina
                  });

        let ret = new Listados<Casos>();
        ret.total=count;
        ret.per_page=list.length;
        ret.current_page=pagina;
        ret.last_page= (filas === 0 ? 0 : Math.ceil(count / filas));
        ret.from=pagina;
        ret.to=list.length;
        ret.data = list;

        res.status(200).send(ret);
      } catch (error) {
        console.error(error);
        res.sendStatus(400);
      }
    }

    public async getCaso (req: Request, res: Response) {
      console.log('getCaso');
      console.log(req.params.tagId);

      let ret = {
          success: false,
          data: null,
          message: null
      };

      let id = req.params.tagId;

      try {
        let caso = await CasosService.getCasoById (id);

        ret.success = true;
        ret.message = null;
        ret.data = caso;

        //console.log(caso);
        res.status(200).send(ret);
      } catch (error) {
        console.error(error);
        ret.success = false;
        ret.message = error;
        res.status(400).send(ret);
      }

    }

    private static async getCasoById (id) {
      let caso = await getConnection().getRepository(Casos).findOne({relations: ["casosxestados", "municipio", "citas", "citas.centro"], where: {id: id}});

      if (caso) {
        return caso;
      } else {
        return null;
      }
    }

    public async crearCaso (req: Request, res: Response) {
        let errores = {
            existenErrores: false,
            mensaje: ''
        }
        try {
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
                    newCaso.municipio = caso.municipio;
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

    public async saveCaso (req: Request, res: Response) {
      let ret = {
          success: false,
          data: null,
          message: null
      };
      try {
          console.log('saveCaso')
          let caso = req.body;
          console.log(caso);

          if (caso) {
            //Añadimos a casosxestado el caso para que no actualice los que ya existen a null

            //Si el caso es CO, en la tabla casosxestado el nuevo estado
            if (caso.estado==='CO') {
              //Si ya estaba no lo vuelve a insertar
              let cxe = await getConnection().getRepository(Casosxestados).findOne({where: {caso: caso, estado:'CO'}});

              if (!cxe) {
                let newCasoXEstado: Casosxestados = new Casosxestados();
                newCasoXEstado.estado = caso.estado;
                newCasoXEstado.fecha = new Date();
                newCasoXEstado.caso = caso;
                newCasoXEstado = await getConnection().getRepository(Casosxestados).save(newCasoXEstado);

                //lo añadimos al caso
                if (!caso.casosxestados) {
                  caso.casosxestados = [];
                }
                caso.casosxestados.push(newCasoXEstado);
              }
            }

            //Si se añade un resultadotest, y no está en estado 'PE' o 'FI', pasa a estado 'PE'
            if (caso.resultadotest !== null && caso.estado!=='PE' && caso.estado!=='FI') {
              caso.estado='PE';
              if (caso.resultadotest === 'N') {
                caso.estado='FI';
              }

              //insertamos en la tabla casosxestado el nuevo estado
              let newCasoXEstado: Casosxestados = new Casosxestados();
              newCasoXEstado.estado = caso.estado;
              newCasoXEstado.fecha = new Date();
              newCasoXEstado.caso = caso;
              newCasoXEstado = await getConnection().getRepository(Casosxestados).save(newCasoXEstado);

              //lo añadimos al caso
              if (!caso.casosxestados) {
                caso.casosxestados = [];
              }
              caso.casosxestados.push(newCasoXEstado);
            }

            //Si se añade un resultado, pasa a estado 'FI'
            if (caso.resultado !== null) {
              caso.estado='FI';

              //insertamos en la tabla casosxestado el nuevo estado
              let newCasoXEstado: Casosxestados = new Casosxestados();
              newCasoXEstado.estado = caso.estado;
              newCasoXEstado.fecha = new Date();
              newCasoXEstado.caso = caso;
              newCasoXEstado = await getConnection().getRepository(Casosxestados).save(newCasoXEstado);

              //lo añadimos al caso
              if (!caso.casosxestados) {
                caso.casosxestados = [];
              }
              caso.casosxestados.push(newCasoXEstado);
            }

            //Las citas. Si la fecha es null, no guardamos la cita ¡¡De momento sólo se permite una cita!!
            if (caso.citas && caso.citas.length>0) {
              let changeEstado = false;
              for (let i in caso.citas) {
                if (!caso.citas[i].fecha || caso.citas[i].fecha==='') {
                  caso.citas.splice(i, 1);
                } else {
                  caso.citas[i]["caso"] = caso;
                  caso.citas[i].fecha=new Date(caso.citas[i].fecha);
                  caso.citas[i].hora=new Date(caso.citas[i].hora);
                  if (caso.citas[i].id===null) {
                    changeEstado = true;
                  }
                  //console.log(caso.citas[i])
                  await getConnection().getRepository(Citas).save(caso.citas[i]);
                }
              }

              //Si antes no existía cita y estamos en estado 'PC' o 'CO', el estado cambia a 'PT' y guardamos en casosxestados
              if (changeEstado && (caso.estado==='PC' || caso.estado==='CO')) {
                caso.estado='PT';

                //insertamos en la tabla casosxestado el nuevo estado
                let newCasoXEstado: Casosxestados = new Casosxestados();
                newCasoXEstado.estado = caso.estado;
                newCasoXEstado.fecha = new Date();
                newCasoXEstado.caso = caso;
                newCasoXEstado = await getConnection().getRepository(Casosxestados).save(newCasoXEstado);

                //lo añadimos al caso
                if (!caso.casosxestados) {
                  caso.casosxestados = [];
                }
                caso.casosxestados.push(newCasoXEstado);
              }
            }

            //console.log(caso);
            await getConnection().getRepository(Casos).save(caso);

            //Recuperamos los datos a devolver (con el formato a devolver)
            let udatedCaso = await CasosService.getCasoById (caso.id);
            ret.success = true;
            ret.message = null;
            ret.data = udatedCaso;
          } else {
              ret.success = false;
              ret.message = 'No se ha encontrado el caso';
          }
        } catch (error) {
            console.error(error);
            ret.success = false;
            ret.message = 'Ha ocurrido un error al guardar el caso';
        }

        if (!ret.success) {
            res.status(400).send(ret);
        } else {
            res.status(200).send(ret);
        }
    }

    public async getContadores (req: Request, res: Response) {
      console.log('getContadores')
      let ret = {
          success: false,
          data: null,
          message: null
      };

      try {
        let contadores = {pendientes: 0, programados: 0, evolucion: 0};

        let c = await getConnection().manager.count(Casos, {estado: In(['PC', 'CO'])});
        contadores.pendientes = c;

        c = await getConnection().manager.count(Casos, {estado: In(['PT', 'PR'])});
        contadores.programados = c;

        c = await getConnection().manager.count(Casos, {estado: In(['PE', 'FI'])});
        contadores.evolucion = c;

        ret.success = true;
        ret.message = null;
        ret.data = contadores;
        res.status(200).send(ret);
      } catch (error) {
          console.error(error);
          res.sendStatus(400);
      }
    }

}
