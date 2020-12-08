const User = require('../../models/User');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../../config')
module.exports = {
    Mutation: {
        async register(_, {registerInput: {username, email, password, confirmPassword}}, context, info){
            // TODO: Validate user data
            // TODO: Make sure user doesn't already exist
            // TODO: Hash password and create auth token
            password = await bcrypt.hash(password,12);

            const newUser = new User({
                email,
                password,
                username,
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save();
            console.log(res);
            
            const token = jwt.sign(
                {
                id: res.id,
                email: res.email,
                username: res.username
                }, 
                SECRET_KEY,
                {expiresIn: '1h'}
            );

            return{
                ...res._doc,
                id:res._id,
                token
            }
        }
    }
}