import { ContainerModule } from 'inversify';
import { RabbitMqService } from './rabbitmq.service';

const RabbitMqModule = new ContainerModule(({ bind }) => {
  bind(RabbitMqService).toSelf().inSingletonScope();
});

export default RabbitMqModule;
