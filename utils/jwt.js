const { expressjwt: expressJwt } = require('express-jwt');


function verifyToken() {
    return expressJwt({
        secret: process.env.JWT_SECRET,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            {
                url: /\/api\/v1\/products(.*)/,
                methods: ['GET', 'OPTIONS']
            },
            {
                url: /\/api\/v1\/categories(.*)/,
                methods: ['GET', 'OPTIONS']
            },
            `${process.env.API_URL}/users/login`,
            `${process.env.API_URL}/users/signup`
        ]
    })
}

async function isRevoked(req, jwt) {
    const payload = jwt.payload
    return !payload.isAdmin
}

module.exports = verifyToken;