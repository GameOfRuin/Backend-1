import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { JwtGuard } from '../../guards/jwt.guard';
import { IdNumberDto } from '../../shared';
import { validate } from '../../validate';
import { JwtService } from '../jwt/jwt.service';
import { CreateTaskDto } from './dto';
import { GetTaskListDto } from './dto/sort-by.dto';
import { UpdateTaskDto } from './dto/update.dto';
import { TaskService } from './task.service';

@injectable()
export class TaskController {
  public readonly router = Router();

  constructor(
    @inject(TaskService)
    private readonly taskService: TaskService,
    @inject(JwtService)
    private readonly jwtService: JwtService,
  ) {
    this.router.get('/', (req: Request, res: Response) => this.getTasks(req, res));
    this.router.get(
      '/authored',
      JwtGuard(this.jwtService),
      (req: Request, res: Response) => this.getAuthored(req, res),
    );
    this.router.get('/:id', (req: Request, res: Response) => this.getTaskById(req, res));

    this.router.post('/', (req: Request, res: Response) => this.createTask(req, res));
    this.router.put('/:id', (req: Request, res: Response) => this.updateTask(req, res));
    this.router.delete('/:id', (req: Request, res: Response) => this.deleteOne(req, res));
  }
  async getTasks(req: Request, res: Response) {
    const dto = validate(GetTaskListDto, req.query);

    const result = await this.taskService.getTasks(dto);

    res.json(result);
  }

  async getTaskById(req: Request, res: Response) {
    const { id: taskId } = validate(IdNumberDto, req.params);

    const result = await this.taskService.getTaskById(taskId);

    res.json(result);
  }

  async getAuthored(req: Request, res: Response) {
    const {
      user: { id },
    } = res.locals;
    const dto = validate(GetTaskListDto, req.query);

    const result = await this.taskService.getAuthored(dto, id);

    res.json(result);
  }

  async createTask(req: Request, res: Response) {
    const dto = validate(CreateTaskDto, req.body);

    const result = await this.taskService.createTask(dto);

    res.json(result);
  }

  async updateTask(req: Request, res: Response) {
    const { id: taskId } = validate(IdNumberDto, req.params);
    const dto = validate(UpdateTaskDto, req.body);

    const result = await this.taskService.updateTask(dto, taskId);

    res.json(result);
  }

  async deleteOne(req: Request, res: Response) {
    const { id } = validate(IdNumberDto, req.params);

    const result = await this.taskService.deleteOne(id);

    res.json(result);
  }
}
