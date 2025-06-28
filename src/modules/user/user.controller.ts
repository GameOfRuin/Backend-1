import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { JwtGuard } from '../../guards/jwt.guard';
import { validate } from '../../validate';
import { JwtService } from '../jwt/jwt.service';
import { LoginUserDto, PasswordChangeDto, RefreshTokenDto, RegisterUserDto } from './dto';
import { UserService } from './user.service';

@injectable()
export class UserController {
  public readonly router = Router();

  constructor(
    @inject(UserService)
    private readonly userService: UserService,
    @inject(JwtService)
    private readonly jwtService: JwtService,
  ) {
    this.router.post('/register', (req: Request, res: Response) =>
      this.register(req, res),
    );
    this.router.post('/login', (req: Request, res: Response) => this.login(req, res));
    this.router.post('/logout', (req: Request, res: Response) => this.logout(req, res));
    this.router.put('/password/change', (req: Request, res: Response) =>
      this.passwordChange(req, res),
    );
    this.router.get(
      '/profile',
      JwtGuard(this.jwtService),
      (req: Request, res: Response) => this.profile(req, res),
    );
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

  async profile(req: Request, res: Response) {
    const {
      user: { id },
    } = res.locals;

    const result = await this.userService.profile(id);

    res.json(result);
  }

  async logout(req: Request, res: Response) {
    const { refreshToken } = validate(RefreshTokenDto, req.body);

    const result = await this.userService.logout(refreshToken);

    res.json(result);
  }

  async passwordChange(req: Request, res: Response) {
    const dto = validate(PasswordChangeDto, req.body);

    const result = await this.userService.passwordChange(dto);

    res.json(result);
  }
}
