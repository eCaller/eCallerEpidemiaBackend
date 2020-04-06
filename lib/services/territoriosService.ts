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
import { getConnection, In } from 'typeorm';
import { Provincias } from '../models/provincias'
import { Municipios } from '../models/municipios';
import { Distritos } from '../models/distritos';
import { Departamentos } from '../models/departamentos';
import { Centros } from '../models/centros';

export class TerritoriosService {

    public async findAllCentros (req: Request, res: Response) {
        try {
            console.log("findAllCentros");
            let entity = await getConnection().getRepository(Centros).find({order: {nombre: "ASC"}});
            res.send(entity);
        } catch (error) {
            res.sendStatus(500);
        }

    }

    public async findAllDepartamentos (req: Request, res: Response) {
        try {
            console.log("findAllDepartamentos");
            let entity = await getConnection().getRepository(Departamentos).find({order: {nombre: "ASC"}});
            res.send(entity);
        } catch (error) {
            res.sendStatus(500);
        }

    }

    public async findProvincias (req: Request, res: Response) {
        try {
            console.log("findProvincias");
            console.log(req.query.departamentos);
            let departamentos = req.query.departamentos;
            let entity = [];
            if (departamentos && departamentos.length>0) {
              entity = await getConnection().getRepository(Provincias).find({where: {departamento: In(departamentos)}, order: {nombre: "ASC"}});
            }
            res.send(entity);
        } catch (error) {
            res.sendStatus(500);
        }

    }

    public async findMunicipios (req: Request, res: Response) {
        try {
            console.log("findMunicipios");
            console.log(req.query.provincias);
            let provincias = req.query.provincias;
            let entity = [];
            if (provincias && provincias.length>0) {
              entity = await getConnection().getRepository(Municipios).find({where: {provincia: In(provincias)}, order: {nombre: "ASC"}});
            } else {
              entity = await getConnection().getRepository(Municipios).find({order: {nombre: "ASC"}});
            }
            res.send(entity);
        } catch (error) {
            res.sendStatus(500);
        }

    }

    public async findDistritos (req: Request, res: Response) {
        try {
            console.log("findDistritos");
            console.log(req.query.municipios);
            let municipios = req.query.municipios;
            console.log(municipios);
            let entity = [];
            if (municipios && municipios.length>0) {
              entity = await getConnection().getRepository(Distritos).find({where: {municipio: In(municipios)}, order: {nombre: "ASC"}});
            }
            res.send(entity);
        } catch (error) {
            res.sendStatus(500);
        }

    }

}
