export {};

declare global {
  namespace Express {
    export interface Request {
      userId?: number;
      role: string;
      cleanBody?: any;
    }
  }
}
