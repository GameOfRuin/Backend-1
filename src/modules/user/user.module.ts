import { Container } from 'inversify';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const UserModule = new Container();

UserModule.bind(UserService).toSelf().inSingletonScope();
UserModule.bind(UserController).toSelf().inSingletonScope();

export default UserModule;
