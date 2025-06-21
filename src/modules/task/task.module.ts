import { ContainerModule } from 'inversify';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

const TaskModule = new ContainerModule(({ bind }) => {
  bind(TaskService).toSelf().inSingletonScope();
  bind(TaskController).toSelf().inSingletonScope();
});
export default TaskModule;
