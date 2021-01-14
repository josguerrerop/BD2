const pgp = require("pg-promise")({});
const cn = {
    user: 'postgres',
    host: 'localhost',
    password: '',
    database: 'prontomueble',
    port: '8080'
};
const db = pgp(cn);
module.exports = db;