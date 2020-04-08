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
import { ChartsService } from '../services/chartsService';
import { ConfiguracionService } from '../services/configuracionService';

const passport = require('passport');

export class RoutesWeb {

    public preguntaService: PreguntaService = new PreguntaService();
    public casospositivosService: CasospositivosService = new CasospositivosService();
    public variablesService: VariablesService = new VariablesService();
    public casosService: CasosService = new CasosService();
    public territoriosService: TerritoriosService = new TerritoriosService();
    public loginService: LoginService = new LoginService();
    public healthService: HealthService = new HealthService();
    public chartsService: ChartsService = new ChartsService();
	public configuracionService: ConfiguracionService = new ConfiguracionService();


    public routes(app): void {
        app.route('/autenticacion/login')
            .post(passport.authenticate('local', {session: false}), this.loginService.login)            
        app.route('/autenticacion/logout')
            .get(passport.authenticate('jwt', {session: false}), this.loginService.logout)
        app.route('/triage')
            .get(passport.authenticate('jwt', {session: false}), this.preguntaService.findAllPreguntas)
            .post(passport.authenticate('jwt', {session: false}), this.preguntaService.savetriage)
        app.route('/triage/caso/:tagId')
            .get(passport.authenticate('jwt', {session: false}), this.preguntaService.findTriagecaso)
        app.route('/casospositivos')
            .get(passport.authenticate('jwt', {session: false}), this.casospositivosService.findAllCasospositivos)
        app.route('/variables')
            .get(passport.authenticate('jwt', {session: false}), this.variablesService.findAllVariables)
            .put(passport.authenticate('jwt', {session: false}), this.variablesService.saveVariables)
        app.route('/caso')
            .get(passport.authenticate('jwt', {session: false}), this.casosService.findCasos)
            .put(passport.authenticate('jwt', {session: false}), this.casosService.saveCaso)
        app.route('/caso/:tagId')
            .get(passport.authenticate('jwt', {session: false}), this.casosService.getCaso)
        app.route('/casos/contadores')
            .get(passport.authenticate('jwt', {session: false}), this.casosService.getContadores)
        app.route('/casos/resumen')
            .get(passport.authenticate('jwt', {session: false}), this.chartsService.getResumen)
        app.route('/casos/estadisticas')
            .get(passport.authenticate('jwt', {session: false}), this.chartsService.getEstadisticas)
        app.route('/casos/mapa')
            .get(passport.authenticate('jwt', {session: false}), this.chartsService.getCasosMapa)
        app.route('/centros')
            .get(passport.authenticate('jwt', {session: false}), this.territoriosService.findAllCentros)
        app.route('/departamentos')
            .get(passport.authenticate('jwt', {session: false}), this.territoriosService.findAllDepartamentos)
        app.route('/provincias')
            .get(passport.authenticate('jwt', {session: false}), this.territoriosService.findProvincias)
        app.route('/municipios')
            .get(passport.authenticate('jwt', {session: false}), this.territoriosService.findMunicipios)
        app.route('/distritos')
            .get(passport.authenticate('jwt', {session: false}), this.territoriosService.findDistritos)
        app.route('/health/status')
            .get(this.healthService.testStatus)
		app.route('/configuracionUsuario')
            .post(passport.authenticate('jwt', {session: false}), this.configuracionService.updatePassword)
        app.route('/checkPassword')
            .post(passport.authenticate('local', {session: false}), this.configuracionService.checkPassword)

    }
}
