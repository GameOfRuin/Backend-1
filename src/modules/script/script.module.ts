import { ContainerModule } from 'inversify';
import { ScriptController } from './script.controller';
import { ScriptService } from './script.service';

const ScriptModule = new ContainerModule(({ bind }) => {
  bind(ScriptService).toSelf().inSingletonScope();
  bind(ScriptController).toSelf().inSingletonScope();
});

export default ScriptModule;
