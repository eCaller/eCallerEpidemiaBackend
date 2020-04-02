import * as express from "express";
import * as bodyParser from "body-parser";
import { Routes } from './routes/routes';
import "reflect-metadata"; // Import para typerom
import { createConnection } from 'typeorm';
const config = require('./config')
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

class App {
    public app: express.Application;
    public rutas: Routes = new Routes();

    constructor() {
        this.app = express();
        this.config();
        this.rutas.routes(this.app);
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
                Variables
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
