import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { JwtGuard } from '../../guards/jwt.guard';
import { RoleGuard } from '../../guards/role.guard';
import { IdNumberDto } from '../../shared';
import { validate } from '../../validate';
import { JwtService } from '../jwt/jwt.service';
import {
  LoginUserDto,
  PasswordChangeDto,
  PasswordRestoreDto,
  RefreshTokenDto,
  RegisterUserDto,
} from './dto';
import { ApproveDto } from './dto/approve.dto';
import { PasswordRestoreChangeDto } from './dto/password-restore-change.dto';
import { UserService } from './user.service';
import { UserRoleEnum } from './user.types';

@injectable()
export class UserController {
  public readonly router = Router();

  constructor(
    @inject(UserService)
    private readonly userService: UserService,
    @inject(JwtService)
    private readonly jwtService: JwtService,
  ) {
    const authentication = JwtGuard(this.jwtService);
    const authorization = [authentication, RoleGuard(UserRoleEnum.admin)];

    this.router.post('/register', (req: Request, res: Response) =>
      this.register(req, res),
    );
    this.router.post('/login', (req: Request, res: Response) => this.login(req, res));
    this.router.post(
      '/email/send-approval',
      JwtGuard(this.jwtService),
      (req: Request, res: Response) => this.sendApproval(req, res),
    );
    this.router.post(
      '/email/approve',
      JwtGuard(this.jwtService),
      (req: Request, res: Response) => this.approve(req, res),
    );
    this.router.post(
      '/refresh',
      JwtGuard(this.jwtService),
      (req: Request, res: Response) => this.refresh(req, res),
    );
    this.router.post(
      '/logout',
      JwtGuard(this.jwtService),
      (req: Request, res: Response) => this.logout(req, res),
    );
    this.router.post('/password/restore', (req: Request, res: Response) =>
      this.passwordRestore(req, res),
    );
    this.router.post('/:id/block', authorization, (req: Request, res: Response) =>
      this.changeIsActive(req, res, false),
    );
    this.router.post('/:id/unblock', authorization, (req: Request, res: Response) =>
      this.changeIsActive(req, res, true),
    );
    this.router.put('/password/change', (req: Request, res: Response) =>
      this.passwordChange(req, res),
    );
    this.router.put('/password/restore/change', (req: Request, res: Response) =>
      this.passwordRestoreChange(req, res),
    );
    this.router.get(
      '/profile',
      JwtGuard(this.jwtService),
      (req: Request, res: Response) => this.profile(req, res),
    );
    this.router.get(
      '/profile/telegram-link',
      JwtGuard(this.jwtService),
      (req: Request, res: Response) => this.telegramLink(req, res),
    );
  }

  async register(req: Request, res: Response) {
    const dto = validate(RegisterUserDto, req.body);

    const result = await this.userService.register(dto);

    res.json(result);
  }

  async sendApproval(req: Request, res: Response) {
    const email = res.locals.user.email;

    const result = await this.userService.sendApproval(email);

    res.json(result);
  }

  async approve(req: Request, res: Response) {
    const dto = validate(ApproveDto, req.body);
    const email = res.locals.user.email;

    const result = await this.userService.approve(dto, email);

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

  async refresh(req: Request, res: Response) {
    const user = res.locals.user;
    const { refreshToken } = validate(RefreshTokenDto, req.body);

    const result = await this.userService.refresh(refreshToken, user);

    res.json(result);
  }

  async logout(req: Request, res: Response) {
    const id = res.locals.user.id;
    const { refreshToken } = validate(RefreshTokenDto, req.body);

    const result = await this.userService.logout(refreshToken, id);

    res.json(result);
  }

  async passwordChange(req: Request, res: Response) {
    const dto = validate(PasswordChangeDto, req.body);

    const result = await this.userService.passwordChange(dto);

    res.json(result);
  }

  async passwordRestore(req: Request, res: Response) {
    const dto = validate(PasswordRestoreDto, req.body);

    const result = await this.userService.passwordRestore(dto);

    res.json(result);
  }

  async passwordRestoreChange(req: Request, res: Response) {
    const dto = validate(PasswordRestoreChangeDto, req.body);

    const result = await this.userService.passwordRestoreChange(dto);

    res.json(result);
  }

  async changeIsActive(req: Request, res: Response, active: boolean) {
    const { id } = validate(IdNumberDto, req.params);

    const result = await this.userService.changeIsActive(id, active);

    res.json(result);
  }

  async telegramLink(req: Request, res: Response) {
    const id = res.locals.user.id;

    const result = await this.userService.telegramLink(id);

    res.json(result);
  }
}
