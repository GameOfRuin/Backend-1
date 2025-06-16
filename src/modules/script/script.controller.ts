import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { IdNumberDto } from '../../shared';
import { validate } from '../../validate';
import { PaginationDto } from './dto';
import { ScriptService } from './script.service';

@injectable()
export class ScriptController {
  public readonly router = Router();

  constructor(
    @inject(ScriptService)
    private readonly scriptService: ScriptService,
  ) {
    this.router.get('/', (req: Request, res: Response) => this.fetchScript(req, res));
    this.router.get('/complexScripts', (req: Request, res: Response) =>
      this.fetchComplexScript(req, res),
    );
    this.router.get('/:id', (req: Request, res: Response) =>
      this.getScriptById(req, res),
    );
    this.router.get('/complexScripts/:id', (req: Request, res: Response) =>
      this.getComplexScriptById(req, res),
    );
  }

  fetchScript(req: Request, res: Response) {
    const dto = validate(PaginationDto, req.query);

    const result = this.scriptService.fetchScript(dto);

    res.json(result);
  }

  fetchComplexScript(req: Request, res: Response) {
    const dto = validate(PaginationDto, req.query);

    const result = this.scriptService.fetchComplexScript(dto);

    res.json(result);
  }

  getScriptById(req: Request, res: Response) {
    const { id } = validate(IdNumberDto, req.params);

    const result = this.scriptService.getScriptById(id);

    res.json(result);
  }

  getComplexScriptById(req: Request, res: Response) {
    const { id } = validate(IdNumberDto, req.params);

    const result = this.scriptService.getComplexScriptById(id);

    res.json(result);
  }
}
