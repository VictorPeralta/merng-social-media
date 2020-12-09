const {ApolloServer} = require('apollo-server');
const mongoose = require('mongoose');

const {MONGODB_STRING} = require('./config.js');
const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers/index')

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context:({req}) => ({req})
});

mongoose.connect(MONGODB_STRING, {useNewUrlParser: true})
    .then(() => {
        console.log('MongoDB Connected');
        return server.listen({port:5000});
    })
    .then(res => {
        console.log(`Server running at ${res.url}`);
    })
    .catch(err => console.log(err));