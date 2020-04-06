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
 * @author "Juan Carlos Díaz Abad" <jcdiaz@ingenia.es>
 */
import { Request, Response } from 'express';
import { getConnection } from 'typeorm';

export class HealthService {

    /**
	 * Test by health node 
	 */
    public async testStatus (req: Request, res: Response) { 
		var codigo = 200; 
		try {
          let conectado = await getConnection().isConnected;
		  
		  if(!conectado){
			codigo = 503; // 503 Service Unavailable
		  }
		  res.status(codigo).send({
                        health: conectado,
                        host: req.headers.host
                    });
        } catch (error) {
          res.sendStatus(500).send({
                        health: false,
                        host: req.headers.host
                    });
        }
		
		
					
    }

}