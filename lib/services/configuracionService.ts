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

    public async updatePassword(req: Request, res: Response) {
        try {
          let usuario = req.body;
          let usuarioBBDD: Usuarios = await getConnection().getRepository(Usuarios).findOne({where: {'username': usuario.username}});
          if (usuarioBBDD != null) {
            usuarioBBDD.password = await bcrypt.hash(usuario.password, 10);
            await getConnection().getRepository(Usuarios).save(usuarioBBDD);
            res.sendStatus(200);
          } else {
            res.sendStatus(404);
          }
        } catch (error) {
          res.sendStatus(500);
        }
    }

    public async checkPassword(req: Request, res: Response) {
      // Si llega aquí, la password es correcta ya que la petición la procesa el 
      // passport 'local'
      res.sendStatus(200);
    }
}
