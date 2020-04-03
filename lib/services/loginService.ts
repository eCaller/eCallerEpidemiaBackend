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

export class LoginService {

    
    public async login (req: Request, res: Response) {        
        let headers = req.headers;
        let auth = headers.authorization;
        if (auth != undefined) {
            let tmp = auth.split(' ');
            let decoded = Buffer.from(tmp[1], 'base64');
            let datosUsuario = decoded.toString().split(':');
            
            let usuario = datosUsuario[0];
            let pass = datosUsuario[1];
            console.log(usuario);
            console.log(pass);
            let usuarioBBDD: Usuarios[] = await getConnection().getRepository(Usuarios).find({where: {'username': usuario}});
            if (usuarioBBDD[0] != null) {
                if (pass === Buffer.from(usuarioBBDD[0].password, 'base64').toString()) {                    
                    res.status(200).send({
                        id: usuarioBBDD[0].id,
                        nombre: usuarioBBDD[0].nombre,
                        username: usuarioBBDD[0].username,
                        imagen: usuarioBBDD[0].imagen,
                        rol: usuarioBBDD[0].rol
                    });
                } else {
                    res.sendStatus(404);
                }               
            } else {                
                res.sendStatus(404);
            }
        }
    }

}