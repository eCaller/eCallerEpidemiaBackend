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
import { Variables } from '../models/variables'

export class VariablesService {
    public async findAllVariables (req: Request, res: Response) {
        try {
          let entity = await getConnection().getRepository(Variables).find();
          res.send(entity);
        } catch (error) {
          res.sendStatus(500);
        }

    }

    public async saveVariables (req: Request, res: Response) {
        try {
          console.log("Guardar Variables");

          let response = req.body;
          let variables = response.variables;

          await getConnection().getRepository(Variables).save(variables);

          console.log("Variables saved");
          res.sendStatus(200);
        } catch (error) {
          res.sendStatus(500);
        }

    }

}
