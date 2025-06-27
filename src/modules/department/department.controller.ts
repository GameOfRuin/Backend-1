import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { IdNumberDto } from '../../shared';
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
      this.getAllDepartment(req, res),
    );
    this.router.delete('/:id', (req: Request, res: Response) =>
      this.deleteDepartment(req, res),
    );
  }

  async createDepartment(req: Request, res: Response) {
    const dto = validate(CreateDepartmentDto, req.body);

    const result = await this.departmentService.createDepartment(dto);

    res.json(result);
  }

  async getAllDepartment(req: Request, res: Response) {
    const result = await this.departmentService.getAllDepartments();

    res.json(result);
  }

  async deleteDepartment(req: Request, res: Response) {
    const { id } = validate(IdNumberDto, req.params);

    const result = this.departmentService.deleteDepartment(id);

    res.json(result);
  }
}
