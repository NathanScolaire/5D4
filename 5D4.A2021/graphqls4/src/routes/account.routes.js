import dayjs from 'dayjs';
import express from 'express';
import httpErrors from 'http-errors';
import expressRateLimit from 'express-rate-limit';
import expressSlowDown from 'express-slow-down';
import jwtMiddlewares from '../middlewares/authorization.jwt.js';

import accountRepository from '../repositories/account.repository.js';

const router = express.Router();

const limiter = expressRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: 'Too many requests'
});

const speedlimiter = expressSlowDown({
    windowsMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 10,
    delayMs: 500
});

class AccountRoutes {
    constructor() {
        router.post('/', this.post);
        router.post('/login', this.login);
        router.post('/refresh', jwtMiddlewares.guardRefreshJWT, this.refreshToken);
        router.get('/secure', jwtMiddlewares.guardAuthorizationJWT, this.secure);
        router.get('/rate-limit', limiter, this.rateLimit);
        router.get('/speed-limit', speedlimiter, this.speedLimit);
        router.delete('/logout', this.logout);
    }

    rateLimit(req, res, next) {
        res.status(200).json(req.rateLimit);
    }

    speedLimit(req, res, next) {
        res.status(200).json(req.slowDown);
    }

    async post(req, res, next) {
        try {
            // Il faudrait valider les informations avant de les ajouter en base de données
            let account = await accountRepository.create(req.body);
            account = account.toObject({ getters: false, virtuals: false });
            account = accountRepository.transform(account);
            res.status(201).json(account);
        } catch (err) {
            return next(httpErrors.InternalServerError(err));
        }
    }

    secure(req, res, next) {
        res.status(200).json(req.user);
    }

    async login(req, res, next) {
        const { username, password } = req.body;
        const result = await accountRepository.login(username, password);

        if (result.account) {
            const token = accountRepository.generateJWT(result.account.email);
            res.status(200).json(token);
        } else {
            return next(result.err);
        }
    }

    async refreshToken(req, res, next) {
        const email = req.refreshToken.email;
        jwtMiddlewares.revokedRefreshedToken.push(req.body.refreshToken);
        const tokens = accountRepository.generateJWT(email);

        res.status(201).json(tokens);
    }

    async logout(req, res, next) {

    }
}

new AccountRoutes();
export default router;