import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { IdNumberDto } from '../../shared';
import { validate } from '../../validate';
import { CreateTaskDto, PaginationDto } from './dto';
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
  getTasks(req: Request, res: Response) {
    const dto = validate(PaginationDto, req.query);

    const result = this.taskService.getTasks(dto);

    res.json(result);
  }

  getTaskById(req: Request, res: Response) {
    const { id } = validate(IdNumberDto, req.params);

    const result = this.taskService.getTaskById(id);

    res.json(result);
  }

  createTask(req: Request, res: Response) {
    const dto = validate(CreateTaskDto, req.body);

    const result = this.taskService.createTask(dto);

    res.json(result);
  }
}
