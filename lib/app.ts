import * as express from "express";
import * as bodyParser from "body-parser";
import { Routes } from './routes/routes';
import "reflect-metadata"; // Import para typerom
import { createConnection } from 'typeorm';
import { databaseHost, databaseSchema, databasePort, databaseUsername, databasePassword } from './config.js'
import { Respuestas } from "./models/respuestas";
import { Preguntas } from "./models/preguntas";
import { Casospositivos } from "./models/casospositivos";
import { Casospositivosxrespuestas } from "./models/casospositivosxrespuestas";
import { Variables } from './models/variables'

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
            host: databaseHost,
            database: databaseSchema,
            port: Number(databasePort),
            username: databaseUsername,
            password: databasePassword,
            entities: [
                Preguntas,
                Respuestas,
                Casospositivos,
                Casospositivosxrespuestas,
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
