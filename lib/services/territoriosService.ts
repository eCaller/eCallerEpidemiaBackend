import { Request, Response } from 'express';
import { getConnection, In } from 'typeorm';
import { Provincias } from '../models/provincias'
import { Municipios } from '../models/municipios';
import { Distritos } from '../models/distritos';
import { Departamentos } from '../models/departamentos';

export class TerritoriosService {
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
