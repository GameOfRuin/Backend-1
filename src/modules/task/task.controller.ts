import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { IdNumberDto, PaginationDto } from '../../shared';
import { validate } from '../../validate';
import { CreateTaskDto } from './dto';
import { TaskService } from './task.service';

@injectable()
export class TaskController {
  public readonly router = Router();

  constructor(
    @inject(TaskService)
    private readonly taskService: TaskService,
  ) {
    this.router.get('/', (req: Request, res: Response) => this.getTasks(req, res));
    this.router.post('/', (req: Request, res: Response) => this.createTask(req, res));
    this.router.get('/:id', (req: Request, res: Response) => this.getTaskById(req, res));
  }
  async getTasks(req: Request, res: Response) {
    const dto = validate(PaginationDto, req.query);

    const result = await this.taskService.getTasks(dto);

    res.json(result);
  }

  async getTaskById(req: Request, res: Response) {
    const { id: taskId } = validate(IdNumberDto, req.params);

    const result = await this.taskService.getTaskById(taskId);

    res.json(result);
  }

  async createTask(req: Request, res: Response) {
    const dto = validate(CreateTaskDto, req.body);

    const result = await this.taskService.createTask(dto);

    res.json(result);
  }
}
