export type LoginAttempt = {
  time: string;
  ip: string;
  email: string;
  success: boolean;
  failReason?: string;
};
