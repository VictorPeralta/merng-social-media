const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server');

const {SECRET_KEY} = require('../config');

module.exports = (ctx) => {
    const authHeader = ctx.req.headers.authorization;
    if(authHeader){
        const token = authHeader.split('Bearer ')[1];
        if(token){
            try{
                const user = jwt.verify(token, SECRET_KEY);
                return user;
            }catch(err){
                throw new AuthenticationError('Invalid/Expired token');
            }
        }
        throw new Error('Authorization token must be provided in Bearer [token] format.')
    }
    throw new Error('Authorization header must be provided.')
}