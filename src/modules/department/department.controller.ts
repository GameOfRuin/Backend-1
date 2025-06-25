import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { IdNumberDto, PaginationDto } from '../../shared';
import { validate } from '../../validate';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto';

@injectable()
export class DepartmentController {
  public readonly router = Router();

  constructor(
    @inject(DepartmentService)
    private readonly departmentService: DepartmentService,
  ) {
    this.router.post('/', (req: Request, res: Response) =>
      this.createDepartment(req, res),
    );
    this.router.get('/', (req: Request, res: Response) =>
      this.fetchComplexScript(req, res),
    );
    this.router.delete('/:id', (req: Request, res: Response) =>
      this.fetchComplexScript(req, res),
    );
  }

  async createDepartment(req: Request, res: Response) {
    const dto = validate(CreateDepartmentDto, req.body);

    const result = await this.departmentService.createDepartment(dto);

    res.json(result);
  }

  fetchComplexScript(req: Request, res: Response) {
    const dto = validate(PaginationDto, req.query);

    const result = this.departmentService.fetchComplexScript(dto);

    res.json(result);
  }

  getScriptById(req: Request, res: Response) {
    const { id } = validate(IdNumberDto, req.params);

    const result = this.departmentService.getScriptById(id);

    res.json(result);
  }

  getComplexScriptById(req: Request, res: Response) {
    const { id } = validate(IdNumberDto, req.params);

    const result = this.departmentService.getComplexScriptById(id);

    res.json(result);
  }
}
