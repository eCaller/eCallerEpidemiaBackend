import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { Casospositivos } from '../models/casospositivos'

export class CasospositivosService {
    public async findAllCasospositivos (req: Request, res: Response) {
        try {
            console.log("Petición casospositivos");
            let entity = await getConnection().getRepository(Casospositivos).find({relations: ['respuestas'], order: {id: "ASC"}});
            console.log(entity);
            res.send(entity)
        } catch (error) {
            res.send(error)
        }

    }

}
