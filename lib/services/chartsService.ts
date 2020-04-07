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
 * @author jfpastor@ingenia.es
 */
import { Request, Response } from 'express';
import { getConnection, In } from 'typeorm';
import { Casos } from '../models/casos'
import { Casosxestados } from '../models/casosxestados';

export class ChartsService {

    public async getCasosMapa (req: Request, res: Response) {
      try {
        console.log('getCasosMapa');
        console.log(req.query.estados);
        console.log(req.query.tipo);
        console.log(req.query.lista);

        let estados = req.query.estados;
        let tipo = req.query.tipo;
        let lista = req.query.lista;

        let ret = [];
        let hoy = new Date();
        let l = null;

        if (estados && estados.filter(it=>it === "Sospechosos").length>0) {
          console.log('* Sospechosos');
          l = await ChartsService.rellenaCasosMapa ("S", await ChartsService.getListaSospechosos(hoy, true, tipo, lista));
          if (l && l.length>0) {
            ret = ret.concat(l);
          }
        }

        if (estados && estados.filter(it=>it === "Confirmados").length>0) {
          console.log('* Confirmados');
          l = await ChartsService.rellenaCasosMapa ("C", await ChartsService.getListaConfirmados(hoy, true, tipo, lista));
          if (l && l.length>0) {
            ret = ret.concat(l);
          }
        }

        if (estados && estados.filter(it=>it === "Activos").length>0) {
          console.log('* Activos');
          l = await ChartsService.rellenaCasosMapa ("A", await ChartsService.getListaActivos(hoy, true, tipo, lista));
          if (l && l.length>0) {
            ret = ret.concat(l);
          }
        }

        if (estados && estados.filter(it=>it === "Recuperados").length>0) {
          console.log('* Recuperados');
          l = await ChartsService.rellenaCasosMapa ("R", await ChartsService.getListaFinal(hoy, 'R', true, tipo, lista));
          if (l && l.length>0) {
            ret = ret.concat(l);
          }
        }

        if (estados && estados.filter(it=>it === "Decesos").length>0) {
          console.log('* Decesos');
          l = await ChartsService.rellenaCasosMapa ("D", await ChartsService.getListaFinal(hoy, 'D', true, tipo, lista));
          if (l && l.length>0) {
            ret = ret.concat(l);
          }
        }

        res.status(200).send(ret);
      } catch (error) {
          console.error(error);
          res.sendStatus(400);
      }
    }

    public async getResumen (req: Request, res: Response) {
      console.log('getResumen')
      console.log(req.query.estados);
      console.log(req.query.tipo);
      console.log(req.query.lista);
      try {
        let ret = {
          sospechosos: {value:0, percent:0, estado:0 }, //estado= 0: el mismo, 1: sube, -1: baja
          confirmados: {value:0, percent:0, estado:0 },
          activos: {value:0, percent:0, estado:0 },
          recuperados: {value:0, percent:0, estado:0 },
          decesos: {value:0, percent:0, estado:0 }
        };

        let estados = req.query.estados;
        let tipo = req.query.tipo;
        let lista = req.query.lista;

        let hoy = new Date();
        let ayer = new Date();
        ayer.setDate(hoy.getDate() - 1);

        let resultadohoy = null;
        let resultadoayer = null;

        if (!estados || (estados && estados.filter(it=>it === "Sospechosos").length>0)) {
          console.log('* Sospechosos');
          resultadohoy = await ChartsService.getResumenSospechosos(hoy, true, tipo, lista);
          resultadoayer = await ChartsService.getResumenSospechosos(ayer, true, tipo, lista);
          ret.sospechosos.value = resultadohoy;
          ret.sospechosos.percent = ((resultadohoy-resultadoayer)*100)/resultadohoy;
          ret.sospechosos.estado = (resultadohoy>resultadoayer?1:(resultadohoy<resultadoayer?-1:0));
        }

        if (!estados || (estados && estados.filter(it=>it === "Confirmados").length>0)) {
          console.log('* Confirmados');
          resultadohoy = await ChartsService.getResumenConfirmados(hoy, true, tipo, lista);
          resultadoayer = await ChartsService.getResumenConfirmados(ayer, true, tipo, lista);
          ret.confirmados.value = resultadohoy;
          ret.confirmados.percent = ((resultadohoy-resultadoayer)*100)/resultadohoy;
          ret.confirmados.estado = (resultadohoy>resultadoayer?1:(resultadohoy<resultadoayer?-1:0));
        }

        if (!estados || (estados && estados.filter(it=>it === "Activos").length>0)) {
          console.log('* Activos');
          resultadohoy = await ChartsService.getResumenActivos(hoy, true, tipo, lista);
          resultadoayer = await ChartsService.getResumenActivos(ayer, true, tipo, lista);
          ret.activos.value = resultadohoy;
          ret.activos.percent = ((resultadohoy-resultadoayer)*100)/resultadohoy;
          ret.activos.estado = (resultadohoy>resultadoayer?1:(resultadohoy<resultadoayer?-1:0));
        }

        if (!estados || (estados && estados.filter(it=>it === "Recuperados").length>0)) {
          console.log('* Recuperados');
          resultadohoy = await ChartsService.getResumenFinal(hoy, 'R', true, tipo, lista);
          resultadoayer = await ChartsService.getResumenFinal(ayer, 'R', true, tipo, lista);
          ret.recuperados.value = resultadohoy;
          ret.recuperados.percent = ((resultadohoy-resultadoayer)*100)/resultadohoy;
          ret.recuperados.estado = (resultadohoy>resultadoayer?1:(resultadohoy<resultadoayer?-1:0));
        }

        if (!estados || (estados && estados.filter(it=>it === "Decesos").length>0)) {
          console.log('* Decesos');
          resultadohoy = await ChartsService.getResumenFinal(hoy, 'D', true, tipo, lista);
          resultadoayer = await ChartsService.getResumenFinal(ayer, 'D', true, tipo, lista);
          ret.decesos.value = resultadohoy;
          ret.decesos.percent = ((resultadohoy-resultadoayer)*100)/resultadohoy;
          ret.decesos.estado = (resultadohoy>resultadoayer?1:(resultadohoy<resultadoayer?-1:0));
        }

        res.status(200).send(ret);
      } catch (error) {
          console.error(error);
          res.sendStatus(400);
      }
    }

    public async getEstadisticas (req: Request, res: Response) {
      console.log('getEstadisticas')
      console.log(req.query.acumulado);
      console.log(req.query.estados);
      console.log(req.query.tipo);
      console.log(req.query.lista);
      try {
        let acumulado = (req.query.acumulado === undefined || req.query.acumulado.toLowerCase() === 'false' ? false : true);

        let estados = req.query.estados;
        let tipo = req.query.tipo;
        let lista = req.query.lista;

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
          let resultado = 0;

          if (estados && estados.filter(it=>it === "Sospechosos").length>0) {
            resultado = await ChartsService.getResumenSospechosos(fecha, acumulado, tipo, lista);
          }
          ret.sospechosos.push(resultado);

          resultado = 0;
          if (estados && estados.filter(it=>it === "Confirmados").length>0) {
            resultado = await ChartsService.getResumenConfirmados(fecha, acumulado, tipo, lista);
          }
          ret.confirmados.push(resultado);

          resultado = 0;
          if (estados && estados.filter(it=>it === "Activos").length>0) {
            resultado = await ChartsService.getResumenActivos(fecha, acumulado, tipo, lista);
          }
          ret.activos.push(resultado);

          resultado = 0;
          if (estados && estados.filter(it=>it === "Recuperados").length>0) {
            resultado = await ChartsService.getResumenFinal(fecha, 'R', acumulado, tipo, lista);
          }
          ret.recuperados.push(resultado);

          resultado = 0;
          if (estados && estados.filter(it=>it === "Decesos").length>0) {
            resultado = await ChartsService.getResumenFinal(fecha, 'D', acumulado, tipo, lista);
          }
          ret.decesos.push(resultado);

          fecha.setDate(fecha.getDate() + 1);
        }

        res.status(200).send(ret);
      } catch (error) {
          console.error(error);
          res.sendStatus(400);
      }
    }

    private static async getListaSospechosos(fecha, acumulado, tipo, lista) {
      let op = "<=";
      if (!acumulado) {
        op = "=";
      }

      const query = await getConnection().createQueryBuilder()
          .select("cxe.idcaso")
          .from(Casosxestados, "cxe")
          .innerJoin("cxe.caso", "casos")
          .leftJoin("casos.municipio", "M")
          .leftJoin("M.provincia", "P")
          .leftJoin("P.departamento", "D")
          .where("cxe.estado in (:...estados) and cxe.fecha::date " + op + " :fecha", { estados: ['PC', 'CO', 'PT', 'PR'], fecha: fecha });

      if (tipo && lista && lista.length>0) {
        query.andWhere(tipo + ".id in (:...lista)", { lista: lista });
      }

      let casos = query
          .groupBy("cxe.idcaso")
          .execute();

      if (casos) {
        return casos;
      } else {
        return null;
      }
    }

    private static async getResumenSospechosos(fecha, acumulado, tipo, lista) {
      let casos = await ChartsService.getListaSospechosos(fecha, acumulado, tipo, lista);
      if (casos) {
        return casos.length;
      } else {
        return 0;
      }
    }

    private static async getListaConfirmados(fecha, acumulado, tipo, lista) {
      let op = "<=";
      if (!acumulado) {
        op = "=";
      }

      const query = await getConnection().createQueryBuilder()
          .select("cxe.idcaso")
          .from(Casosxestados, "cxe")
          .innerJoin("cxe.caso", "casos")
          .leftJoin("casos.municipio", "M")
          .leftJoin("M.provincia", "P")
          .leftJoin("P.departamento", "D")
          .where("cxe.estado in (:...estados) and cxe.fecha::date " + op + " :fecha and casos.resultadotest = :resultadotest", { estados: ['PE'], fecha: fecha, resultadotest: 'P' });

      if (tipo && lista && lista.length>0) {
        query.andWhere(tipo + ".id in (:...lista)", { lista: lista });
      }

      let casos = query
          .groupBy("cxe.idcaso")
          .execute();

      if (casos) {
        return casos;
      } else {
        return null;
      }
    }

    private static async getResumenConfirmados(fecha, acumulado, tipo, lista) {
      let casos = await ChartsService.getListaConfirmados(fecha, acumulado, tipo, lista);
      if (casos) {
        return casos.length;
      } else {
        return 0;
      }
    }

    private static async getListaActivos(fecha, acumulado, tipo, lista) {
      let op = "<=";
      if (!acumulado) {
        op = "=";
      }

      const query = await getConnection().createQueryBuilder()
          .select("cxe.idcaso")
          .from(Casosxestados, "cxe")
          .innerJoin("cxe.caso", "casos")
          .leftJoin("casos.municipio", "M")
          .leftJoin("M.provincia", "P")
          .leftJoin("P.departamento", "D")
          .where("cxe.estado in (:...estados) and cxe.fecha::date " + op + " :fecha", { estados: ['PE'], fecha: fecha });

      if (tipo && lista && lista.length>0) {
        query.andWhere(tipo + ".id in (:...lista)", { lista: lista });
      }

      let casos = query
          .groupBy("cxe.idcaso")
          .execute();

      if (casos) {
        return casos;
      } else {
        return null;
      }
    }

    private static async getResumenActivos(fecha, acumulado, tipo, lista) {
      let casos = await ChartsService.getListaActivos(fecha, acumulado, tipo, lista);
      if (casos) {
        return casos.length;
      } else {
        return 0;
      }
    }

    //resultado 'R' o 'D'
    private static async getListaFinal(fecha, resultado, acumulado, tipo, lista) {
      let op = "<=";
      if (!acumulado) {
        op = "=";
      }

      const query = await getConnection().createQueryBuilder()
          .select("cxe.idcaso")
          .from(Casosxestados, "cxe")
          .innerJoin("cxe.caso", "casos")
          .leftJoin("casos.municipio", "M")
          .leftJoin("M.provincia", "P")
          .leftJoin("P.departamento", "D")
          .where("cxe.estado in (:...estados) and cxe.fecha::date " + op + " :fecha " +
              "and casos.resultadotest = :resultadotest " +
              "and casos.resultado = :resultado ",
              { estados: ['FI'], fecha: fecha, resultadotest: 'P', resultado: resultado });

      if (tipo && lista && lista.length>0) {
        query.andWhere(tipo + ".id in (:...lista)", { lista: lista });
      }

      let casos = query
          .groupBy("cxe.idcaso")
          .execute();

        if (casos) {
          return casos;
        } else {
          return null;
        }
    }

    private static async getResumenFinal(fecha, resultado, acumulado, tipo, lista) {
      let casos = await ChartsService.getListaFinal(fecha, resultado, acumulado, tipo, lista);
      if (casos) {
        return casos.length;
      } else {
        return 0;
      }
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

        return await ChartsService.getListaCasos(arr, tipo);
      }
    }

}
