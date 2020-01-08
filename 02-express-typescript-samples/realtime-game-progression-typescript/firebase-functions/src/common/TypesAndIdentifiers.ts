import { Request } from 'express';

export interface IncomingRequest extends Request {
    user: string;
}