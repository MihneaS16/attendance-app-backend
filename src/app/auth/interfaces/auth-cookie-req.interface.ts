import { Request } from 'express';

export interface AuthCookieRequest extends Request {
  cookies: {
    Authentication?: string;
    Refresh?: string;
    [key: string]: any;
  };
}
