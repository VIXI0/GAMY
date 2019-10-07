'user strict';

const mysql = require('mysql');
const { MAYA } = require('../config.js');
const util = require('util');
const MyS = mysql.createConnection(MAYA);
exports.MyQ = util.promisify(MyS.query).bind(MyS);
exports.MyS = MyS;
