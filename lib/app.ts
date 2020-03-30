import * as express from "express";
import * as bodyParser from "body-parser";
import { Routes } from './routes/routes';
import "reflect-metadata"; // Import para typerom
import { createConnection } from 'typeorm';
import { Noticia } from './models/noticia'
import { databaseHost, databaseSchema, databasePort, databaseUsername, databasePassword } from './config.js'

class App {
    public app: express.Application;
    public rutas: Routes = new Routes();

    constructor() {
        this.app = express();
        this.config();
        this.rutas.routes(this.app);
    }

    private config(): void {
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
                Noticia
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