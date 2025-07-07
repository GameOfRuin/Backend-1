import { ContainerModule } from 'inversify';
import { TelegramService } from './telegram.service';

const TelegramModule = new ContainerModule(({ bind }) => {
  bind(TelegramService).toSelf().inSingletonScope();
});

export default TelegramModule;
