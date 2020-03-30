import {Request, Response} from 'express';
import { Noticia } from '../models/noticia';
import { getConnection } from 'typeorm';

export class NoticiasService {
    public async findAllNoticias (req: Request, res: Response) {
        try {
            let entity = await getConnection().getRepository(Noticia).find();
            console.log(entity);
            res.send(entity)
        } catch (error) {
            res.send(error)
        }
        
    }
}