import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { Variables } from '../models/variables'

export class VariablesService {
    public async findAllVariables (req: Request, res: Response) {
        try {
          let entity = await getConnection().getRepository(Variables).find();
          res.send(entity);
        } catch (error) {
          res.sendStatus(500);
        }

    }

    public async saveVariables (req: Request, res: Response) {
        try {
          console.log("Guardar Variables");

          let response = req.body;
          let variables = response.variables;

          await getConnection().getRepository(Variables).save(variables);

          console.log("Variables saved");
          res.sendStatus(200);
        } catch (error) {
          res.sendStatus(500);
        }

    }

}
