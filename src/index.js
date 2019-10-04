const { ApolloServer } = require('apollo-server-express');
const express = require("express");

const MyS = require('./MyS');

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

const server = new ApolloServer({ typeDefs, resolvers });
const app = express();



server.applyMiddleware({ app, path: '/' });

MyS.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + MyS.threadId);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
