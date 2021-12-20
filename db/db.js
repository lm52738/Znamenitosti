const {Pool} = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'znamenitosti',
    password: '60144201',
    port: 5433,
});
module.exports = pool;