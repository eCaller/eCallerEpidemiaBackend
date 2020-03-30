import { Request, Response } from 'express';
import { NoticiasService } from '../services/noticiasService';

export class Routes {

    public noticiasService: NoticiasService = new NoticiasService();

    public routes(app): void {
        app.route('/')
            .get(this.noticiasService.findAllNoticias)
    }
}

/*
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Pass to next layer of middleware
    next();
});
*/