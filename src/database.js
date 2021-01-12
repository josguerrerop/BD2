
const pgp = require("pg-promise")({});
const cn = {
    user:'postgres',
    host:'localhost',
    password:'x',
    database:'prontomueble',
    port:'5432'
};
const db = pgp(cn);
module.exports= db;