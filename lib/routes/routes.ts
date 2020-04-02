import { PreguntaService } from '../services/preguntaService';
import { CasospositivosService } from '../services/casospositivosService';
import { VariablesService } from '../services/variablesService';
import { CasosService } from '../services/casosService';
import { TerritoriosService } from '../services/territoriosService';

export class Routes {

    public preguntaService: PreguntaService = new PreguntaService();
    public casospositivosService: CasospositivosService = new CasospositivosService();
    public variablesService: VariablesService = new VariablesService();
    public casosService: CasosService = new CasosService();
    public territoriosService: TerritoriosService = new TerritoriosService();

    public routes(app): void {
        app.route('/triage')
            .get(this.preguntaService.findAllPreguntas)
            .post(this.preguntaService.savetriage)
        app.route('/casospositivos')
            .get(this.casospositivosService.findAllCasospositivos)
        app.route('/variables')
            .get(this.variablesService.findAllVariables)
            .put(this.variablesService.saveVariables)
        app.route('/comprobarTriage')
            .post(this.preguntaService.comprobarTriage)
        app.route('/caso')
            .post(this.casosService.crearCaso)
        app.route('/caso/resumen')
            .get(this.casosService.getResumen)
        app.route('/caso/estadisticas')
            .get(this.casosService.getEstadisticas)
        app.route('/caso/mapa')
            .get(this.casosService.getCasosMapa)
        app.route('/departamentos')
            .get(this.territoriosService.findAllDepartamentos)
        app.route('/provincias')
            .get(this.territoriosService.findProvincias)
        app.route('/municipios')
            .get(this.territoriosService.findMunicipios)
        app.route('/distritos')
            .get(this.territoriosService.findDistritos)

    }
}
