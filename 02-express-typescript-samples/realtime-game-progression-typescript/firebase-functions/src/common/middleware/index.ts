import app from './applyMiddleware';
import _applyResponseMiddleware from './cloudfunctionResponse';
import { Request, Response } from 'express';

export const applyResponseMiddleware = _applyResponseMiddleware;

function prependSlash(req: Request) {
    // without trailing / will have req.path = null, req.url = null
    // which won't match to your app.get('/', ...) route 
    if (!req.path) {
        // prepending '/' keeps query params, path params intact
        req.url = `/${req.url}`
    }
}

export default async function middleware(req: Request, res: Response, cloudFunction: Function) {
    prependSlash(req);
    applyResponseMiddleware(app, cloudFunction);
    return app(req, res);
}
