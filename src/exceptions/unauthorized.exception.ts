export class UnauthorizedException extends Error {
  public readonly code = 404;

  constructor(message = 'Not Found') {
    super(message);
  }
}
