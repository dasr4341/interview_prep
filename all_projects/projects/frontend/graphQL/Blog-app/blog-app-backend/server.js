import { ApolloServer } from 'apollo-server';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { typeDefs } from './Schema.js';// schema
import config from './config.js'
import mongoose from 'mongoose';
import ApolloServerErrorCode from 'apollo-server'
// import { ApolloServerErrorCode } from "@apollo/server/errors";

//--------------------------------
// connecting mongodb 
const { MONGO_URI } = config;
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
});
mongoose.connection.on('connected', () => {
  console.log('connected to mongoDb ');
})
mongoose.connection.on('error', (error) => {
  console.log('error', error);
})
// --------------------------------

import "./models/Post.js";
import "./models/User.js";
// at first db connected 
// then registered the model
// then using that model in reservers
import { resolvers } from './Resolvers.js';// resolvers


// instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (formattedError, error) => {
    // Return a different error message
    if (
      formattedError.extensions.code ===
      ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED
    ) {
      return {
        ...formattedError,
        message: "Your query doesn't match the schema. Try double-checking it!",
      };
    }

    // Otherwise return the formatted error. This error can also
    // be manipulated in other ways, as long as it's returned.
    return formattedError;
  },
  csrfPrevention: true,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground({ embed: true })],
});

// now we will listen to the server
server.listen().then(({ url }) => console.log('listening to ' + url));


