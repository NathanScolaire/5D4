import expressJWT from 'express-jwt';

const guardAuthorizationJWT = expressJWT({
    secret: process.env.JWT_TOKEN_SECRET,
    algorithms: ['HS256']
});

export default {
    guardAuthorizationJWT
}