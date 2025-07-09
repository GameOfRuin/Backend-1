import { ContainerModule } from 'inversify';
import { DepartmentAmqpController } from './department.amqp-controller';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';

const DepartmentModule = new ContainerModule(({ bind }) => {
  bind(DepartmentService).toSelf().inSingletonScope();
  bind(DepartmentController).toSelf().inSingletonScope();
  bind(DepartmentAmqpController).toSelf().inSingletonScope();
});

export default DepartmentModule;
