import { Container } from 'inversify';
import { ScriptController } from './script.controller';
import { ScriptService } from './script.service';

const ScriptModule = new Container();

ScriptModule.bind(ScriptService).toSelf().inSingletonScope();
ScriptModule.bind(ScriptController).toSelf().inSingletonScope();

export default ScriptModule;
