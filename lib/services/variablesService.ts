import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { Variables } from '../models/variables'

export class VariablesService {
    public async findAllVariables (req: Request, res: Response) {
        try {
            console.log("Petición Variables");
            let entity = await getConnection().getRepository(Variables).find();
            console.log(entity);
            res.send(entity)
        } catch (error) {
            res.send(error)
        }

    }

}
