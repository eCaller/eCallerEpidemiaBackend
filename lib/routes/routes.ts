import { PreguntaService } from '../services/preguntaService';
import { CasospositivosService } from '../services/CasospositivosService';
import { VariablesService } from '../services/VariablesService';

export class Routes {

    public preguntaService: PreguntaService = new PreguntaService();
    public casospositivosService: CasospositivosService = new CasospositivosService();
    public variablesService: VariablesService = new VariablesService();

    public routes(app): void {
        app.route('/triage')
            .get(this.preguntaService.findAllPreguntas)
            .post(this.preguntaService.savetriage)
        app.route('/casospositivos')
            .get(this.casospositivosService.findAllCasospositivos)
        app.route('/variables')
            .get(this.variablesService.findAllVariables)
        app.route('/comprobarTriage')
            .post(this.preguntaService.realizarTest)

    }
}
