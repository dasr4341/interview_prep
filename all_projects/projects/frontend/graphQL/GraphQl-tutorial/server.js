import { ApolloServer } from 'apollo-server';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import typeDefs from './Schema.js'; // QUERY
import mongoose from 'mongoose';
import config from './config.js';


// ------------------------------------------------
// mainly 3 parts in - graphQL
// 1. Query (to get data: are basically types and structures)
// 2. Mutation (OPTIONAL : to insert/update/delete data)
// 3. Resolvers (to perform what is written in the query: actual function to perform the QUERY and interacts with the db)
// ------------------------------------------------



// ------------------------------------------------
// connecting to mongoDb
const { MONGO_URI } = config;
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
})
mongoose.connection.on('connected', () => {
    console.log('connected to mongoDb');
})
mongoose.connection.on('error', (error) => {
    console.log('connecting error', error);
})
// ------------------------------------------------
import './models/User.js';
// i need the model before then (for registering the model, when i call the model it gets registered)
// will use it in resolvers
import resolvers from './resolvers.js'; // RESOLVERS



// ------------------------------------------------
// making the instance of the apollo server
const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
    csrfPrevention: true,
    // to enable the playground
    plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground({ embed: true })
    ]
});
// & listening to the server
// we can pass the port '3000' or leave empty --
// server.listen().then(({ url }) => console.log(url))
server.listen('3000').then(({ url }) => console.log(url))

