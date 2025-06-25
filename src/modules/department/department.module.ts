import { ContainerModule } from 'inversify';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';

const DepartmentModule = new ContainerModule(({ bind }) => {
  bind(DepartmentService).toSelf().inSingletonScope();
  bind(DepartmentController).toSelf().inSingletonScope();
});

export default DepartmentModule;
