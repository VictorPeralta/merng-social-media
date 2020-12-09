const User = require('../../models/User');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const {UserInputError} = require('apollo-server');

const { SECRET_KEY } = require('../../config')
const {validateRegisterInput, validateLoginInput} = require('../../util/validator');

function generateToken(user){
    return jwt.sign(
        {
        id: user.id,
        email: user.email,
        username: user.username
        }, 
        SECRET_KEY,
        {expiresIn: '1h'}
    );

}

module.exports = {
    Mutation: {
        async login(_, {username, password}, ctx, info){
            const {errors, valid} = validateLoginInput(username, password)
            console.log('errors', errors, valid)

            if(!valid){
                throw new UserInputError('Errors', {errors});
            }
            const user = await User.findOne({username});

            if(!user){
                errors.general = 'Credentials are incorrect';
                throw new UserInputError('Credentials are incorrect', {errors});
            }

            const match = await bcrypt.compare(password, user.password);
            if(!match){
                errors.general = 'Credentials are incorrect';
                throw new UserInputError('Credentials are incorrect', {errors});
            }

            const token = generateToken(user);
            return {
                ...user._doc,
                id:user._id,
                token
            }
        },
        async register(_, {registerInput: {username, email, password, confirmPassword}}, context, info){
            const {valid, errors} = validateRegisterInput(username,email,password,confirmPassword);
            if(!valid){
                throw new UserInputError('Errors', {errors});
            }
            // TODO: Make sure user doesn't already exist
            const user = await User.findOne({username});
            console.log(user);
            
            if(user){
                throw new UserInputError("Username is already taken", {
                    errors:{
                        username: 'This username is taken'
                    }
                });
            }
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
            
            const token = generateToken(res);

            return{
                ...res._doc,
                id:res._id,
                token
            }
        }
    }
}