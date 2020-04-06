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
import { PreguntaService } from '../services/preguntaService';
import { CasospositivosService } from '../services/casospositivosService';
import { VariablesService } from '../services/variablesService';
import { CasosService } from '../services/casosService';
import { TerritoriosService } from '../services/territoriosService';
import { LoginService } from '../services/loginService';
import { HealthService } from '../services/healthService';
import { AuthMovilService } from '../services/authMovilService';

const urlBaseMovil = '/movil'

export class RoutesMovil {

    public authMovilService: AuthMovilService = new AuthMovilService();
    public preguntaService: PreguntaService = new PreguntaService();
    public variablesService: VariablesService = new VariablesService();
    public casosService: CasosService = new CasosService();
    public territoriosService: TerritoriosService = new TerritoriosService();

    public routes(app): void {
        app.route(urlBaseMovil + '/triage')
            .get(this.authMovilService.authMovil, this.preguntaService.findAllPreguntas)
        app.route(urlBaseMovil + '/variables')
            .get(this.authMovilService.authMovil, this.variablesService.findAllVariables)
        app.route(urlBaseMovil + '/comprobarTriage')
            .post(this.authMovilService.authMovil, this.preguntaService.comprobarTriage)
        app.route(urlBaseMovil + '/caso')
            .post(this.authMovilService.authMovil, this.casosService.crearCaso)
        app.route(urlBaseMovil + '/municipios')
            .get(this.authMovilService.authMovil, this.territoriosService.findMunicipios)
    }
}
