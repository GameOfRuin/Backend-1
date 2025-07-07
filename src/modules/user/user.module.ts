import { ContainerModule } from 'inversify';
import { UserAmqpController } from './user.amqp-controller';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const UserModule = new ContainerModule(({ bind }) => {
  bind(UserService).toSelf().inSingletonScope();
  bind(UserController).toSelf().inSingletonScope();
  bind(UserAmqpController).toSelf().inSingletonScope();
});

export default UserModule;
