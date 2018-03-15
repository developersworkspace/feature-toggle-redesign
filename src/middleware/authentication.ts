import * as express from 'express';

export class AuthenticationMiddleware {

    public static async shouldBeAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        try {
            // const token: string = AuthenticationMiddleware.getAuthorizationToken(req);

            // if (token) {
            //     req['user'] = btoa(token).split(':')[0];
            //     next();
            //     return;
            // }

            // res.status(401).end();

            req['user'] = 'test';
            next();
        } catch (err) {
            console.log(`${req.url} - 401`);
            res.status(401).end();
        }
    }

    private static getAuthorizationToken(req: express.Request): string {
        const authorizationHeader: string = req.get('Authorization');

        if (!authorizationHeader) {
            throw new Error('Invalid token');
        }

        const splittedAuthorizationHeader: string[] = authorizationHeader.split(' ');

        if (splittedAuthorizationHeader.length !== 2 && splittedAuthorizationHeader[0].toLowerCase() === 'basic') {
            throw new Error('Invalid token');
        }

        return splittedAuthorizationHeader[1];
    }
}
