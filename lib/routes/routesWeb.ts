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

export class RoutesWeb {

    public preguntaService: PreguntaService = new PreguntaService();
    public casospositivosService: CasospositivosService = new CasospositivosService();
    public variablesService: VariablesService = new VariablesService();
    public casosService: CasosService = new CasosService();
    public territoriosService: TerritoriosService = new TerritoriosService();
    public loginService: LoginService = new LoginService();
	public healthService: HealthService = new HealthService();

    public routes(app): void {
        app.route('/autenticacion/login')
            .get(this.loginService.login)
        app.route('/triage')
            .get(this.preguntaService.findAllPreguntas)
            .post(this.preguntaService.savetriage)
        app.route('/triage/caso/:tagId')
            .get(this.preguntaService.findTriagecaso)
        app.route('/casospositivos')
            .get(this.casospositivosService.findAllCasospositivos)
        app.route('/variables')
            .get(this.variablesService.findAllVariables)
            .put(this.variablesService.saveVariables)
        app.route('/caso')
            .get(this.casosService.findCasos)
            .put(this.casosService.saveCaso)
        app.route('/caso/:tagId')
            .get(this.casosService.getCaso)
        app.route('/casos/contadores')
            .get(this.casosService.getContadores)
        app.route('/casos/resumen')
            .get(this.casosService.getResumen)
        app.route('/casos/estadisticas')
            .get(this.casosService.getEstadisticas)
        app.route('/casos/mapa')
            .get(this.casosService.getCasosMapa)
        app.route('/centros')
            .get(this.territoriosService.findAllCentros)
        app.route('/departamentos')
            .get(this.territoriosService.findAllDepartamentos)
        app.route('/provincias')
            .get(this.territoriosService.findProvincias)
        app.route('/municipios')
            .get(this.territoriosService.findMunicipios)
        app.route('/distritos')
            .get(this.territoriosService.findDistritos)
		app.route('/health/status')
			.get(this.healthService.testStatus)

    }
}