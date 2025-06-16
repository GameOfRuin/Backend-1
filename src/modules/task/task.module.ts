import { Container } from 'inversify';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

const TaskModule = new Container();

TaskModule.bind(TaskService).toSelf().inSingletonScope();
TaskModule.bind(TaskController).toSelf().inSingletonScope();

export default TaskModule;
