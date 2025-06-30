import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { JwtGuard } from '../../guards/jwt.guard';
import { RoleGuard } from '../../guards/role.guard';
import { IdNumberDto } from '../../shared';
import { validate } from '../../validate';
import { JwtService } from '../jwt/jwt.service';
import { UserRole } from '../user/user.types';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto';

@injectable()
export class DepartmentController {
  public readonly router = Router();

  constructor(
    @inject(DepartmentService)
    private readonly departmentService: DepartmentService,
    @inject(JwtService)
    private readonly jwtService: JwtService,
  ) {
    const authentication = JwtGuard(this.jwtService);
    const authorization = [authentication, RoleGuard(UserRole.admin)];

    this.router.post('/', (req: Request, res: Response) =>
      this.createDepartment(req, res),
    );
    this.router.get('/', (req: Request, res: Response) =>
      this.getAllDepartment(req, res),
    );
    this.router.delete('/:id', authorization, (req: Request, res: Response) =>
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

    const result = await this.departmentService.deleteDepartment(id);

    res.json(result);
  }
}
