import expressJWT from 'express-jwt';

const revokedRefreshedToken = [];

const guardAuthorizationJWT = expressJWT({
    secret: process.env.JWT_TOKEN_SECRET,
    algorithms: ['HS256']
});

const guardRefreshJWT = expressJWT({
    secret: process.env.JWT_REFRESH_SECRET,
    algorithms: ['HS256'],
    requestProperty: 'refreshToken',
    getToken: (req) => {
        //revokedRefreshedToken.push(req.body.refreshToken);
        return req.body.refreshToken;
    },
    isRevoked: (req, payload, done) => {
        const providedToken = req.body.refreshToken;
        const exists = revokedRefreshedToken.includes(providedToken);
        done(null, exists);
    }
});

export default {
    guardAuthorizationJWT,
    guardRefreshJWT,
    revokedRefreshedToken
}