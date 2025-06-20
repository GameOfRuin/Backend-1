import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { validate } from '../../validate';
import { LoginUserDto, RegisterUserDto } from './dto';
import { UserService } from './user.service';

@injectable()
export class UserController {
  public readonly router = Router();

  constructor(
    @inject(UserService)
    private readonly userService: UserService,
  ) {
    this.router.post('/register', (req: Request, res: Response) =>
      this.register(req, res),
    );
    this.router.post('/login', (req: Request, res: Response) => this.login(req, res));
  }

  async register(req: Request, res: Response) {
    const dto = validate(RegisterUserDto, req.body);

    const result = await this.userService.register(dto);

    res.json(result);
  }
  async login(req: Request, res: Response) {
    const dto = validate(LoginUserDto, req.body);

    const result = await this.userService.login(dto);

    res.json(result);
  }
}
