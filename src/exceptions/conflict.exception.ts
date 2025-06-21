export class ConflictException extends Error {
  public readonly code = 409;

  constructor(message = 'Duplicate') {
    super(message);
  }
}
