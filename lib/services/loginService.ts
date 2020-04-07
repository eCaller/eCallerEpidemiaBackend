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
import { Response } from 'express';
import { Usuarios } from '../models/usuarios';
const config = require('../config');
const jwt = require('jsonwebtoken');

export class LoginService {
    
    /**
     * Cuando se entre en este método, será una vez que ya se ha pasado por
     * el passport 'local' y el usuario autenticado se encuentra en req.user
     */
    public async login (req, res: Response) {
        let usuario: Usuarios = req.user;

        // Información que va a contener el JWT
        const payload = {
            userid: usuario.id,
            username: usuario.username,
            expires: Date.now() + parseInt(config.tokenMsExpires),
        };

        /** assigns payload to req.user */
        req.login(payload, {session: false}, (error) => {
            if (error) {
                res.status(400).send({ error });
            }

            /** generate a signed json web token and return it in the response */
            let token = jwt.sign(JSON.stringify(payload), config.secret);

            /** assign our jwt to the cookie */
            //res.cookie('jwt', token, { httpOnly: true, secure: true });
            res.status(200).send({ 
                username: usuario.username, 
                nombre: usuario.nombre,
                rol: usuario.rol,
                imagen: usuario.imagen ,
                token: token  
            });
        });
    }
    
    public async logout (req, res: Response) {
        req.logout();
        res.sendStatus(200);
    }

}