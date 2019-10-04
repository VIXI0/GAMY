'user strict';

const mysql = require('mysql');
const { MAYA } = require('../config.js');

module.exports =  mysql.createConnection(MAYA);
