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
