import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { validate } from '../../validate';
import { RegisterUserDto } from './dto';
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

  register(req: Request, res: Response) {
    const dto = validate(RegisterUserDto, req.body);

    const result = this.userService.register(dto);

    res.json(result);
  }
  login(req: Request, res: Response) {
    const dto = validate(RegisterUserDto, req.body);

    const result = this.userService.login(dto);

    res.json(result);
  }
}
