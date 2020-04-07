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
import * as express from "express";
import * as bodyParser from "body-parser";
import { RoutesWeb } from './routes/routesWeb';
import { RoutesMovil } from './routes/routesMovil';
import "reflect-metadata"; // Import para typerom
import { createConnection } from 'typeorm';
const config = require('./config')
const passport = require('passport');
import { Respuestas } from "./models/respuestas";
import { Preguntas } from "./models/preguntas";
import { Casospositivos } from "./models/casospositivos";
import { Casospositivosxrespuestas } from "./models/casospositivosxrespuestas";
import { Variables } from './models/variables'
import { Casos } from "./models/casos";
import { Casosxestados } from "./models/casosxestados";
import { Departamentos } from './models/departamentos'
import { Provincias } from './models/provincias'
import { Municipios } from './models/municipios'
import { Distritos } from './models/distritos'
import { Casosxrespuestas } from './models/casosxrespuestas';
import { Usuarios } from "./models/usuarios";
import { Citas } from "./models/citas";
import { Centros } from "./models/centros";
import { Passport } from './passport'

class App {
    public app: express.Application;
    public rutasWeb: RoutesWeb = new RoutesWeb();
    public rutasMovil: RoutesMovil = new RoutesMovil();
    public passportStart: Passport = new Passport();

    constructor() {
        this.app = express();
        this.config();
        this.passportStart.init();
        this.rutasWeb.routes(this.app);
        this.rutasMovil.routes(this.app);
    }

    private config(): void {
        // TODO Mejorar como se agregan los middleware
        // https://itnext.io/production-ready-node-js-rest-apis-setup-using-typescript-postgresql-and-redis-a9525871407
        this.app.use(function (req, res, next) {
            // Website you wish to allow to connect
            res.setHeader('Access-Control-Allow-Origin', '*');
            // Request methods you wish to allow
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
            // Pass to next layer of middleware
            next();
        });
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(passport.initialize())

        this.app.disable('x-powered-by');
        createConnection({
            type: 'postgres',
            host: config.databaseHost,
            database: config.databaseSchema,
            port: Number(config.databasePort),
            username: config.databaseUsername,
            password: config.databasePassword,
            entities: [
                Preguntas,
                Respuestas,
                Casospositivos,
                Casospositivosxrespuestas,
                Variables,
                Casos,
                Casosxestados,
                Casosxrespuestas,
                Departamentos,
                Provincias,
                Municipios,
                Distritos,
                Variables,
                Usuarios,
                Citas,
                Centros
            ],
            synchronize: false,
            logging: true
        }).then((connection) => {
            console.log(connection.isConnected)
        }).catch((error) => {
            console.log(error)
        })

    }
}

export default new App().app;
