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
import { Usuarios } from '../models/usuarios';
const bcrypt = require ('bcrypt');

export class ConfiguracionService {

    public async updateUser (req: Request, res: Response) {
        try {
          console.log("Actualizar usuario");

          let response = req.body;
          let variables = response.variables;
          
          //se encripta la pass
          variables.password = await bcrypt.hash(variables.password, 10);
          
          await getConnection().getRepository(Usuarios).save(variables);

          console.log("Usuario actualizado");
          res.sendStatus(200);
        } catch (error) {
          res.sendStatus(500);
        }
    }
}
