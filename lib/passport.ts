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
import { Usuarios } from "./models/usuarios";
import { getConnection, getRepository } from 'typeorm'
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt');
const config = require('./config');

export class Passport {

    public init(): void {
        // Método para generar el token JWT
        passport.use(new LocalStrategy(
            async function (username, password, done) {
                let usuario: Usuarios = await getConnection().getRepository(Usuarios).findOne({where: {'username': username, 'activo': true}});
                if (usuario != null) {
                    let passwordMatch = await bcrypt.compare(password, usuario.password);
                    if (passwordMatch) {
                        done(null, usuario);
                    } else {
                        done(null, false);
                    }                    
                } else {
                    done(null, false);
                }
            }
        ));
        
        // Método usado para autenticar
        passport.use(new JWTStrategy({
            jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
            secretOrKey: config.secret
        },async (jwtPayload, done) => {
            if (jwtPayload.userid != null) {
                let usuario: Usuarios = await getConnection().getRepository(Usuarios).findOne({where: {'id': jwtPayload.userid}});
                if (usuario != null) {
                    if (Date.now() > jwtPayload.expires) {
                        return done('El token ha expirado')
                    }           
                    return done(null, jwtPayload);
                } else {
                    return done(false);
                }
            } else {
                return done(false);
            }
        }));
    }
}