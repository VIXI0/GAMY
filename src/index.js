const { ApolloServer } = require('apollo-server-express');
const express = require("express");

const mysql = require('mysql');
const { MAYA } = require('../config.js')

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

const server = new ApolloServer({ typeDefs, resolvers });
const app = express();

const con = mysql.createConnection(MAYA);

server.applyMiddleware({ app, path: '/' });

con.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + con.threadId);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
