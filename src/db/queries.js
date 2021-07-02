const pool = require('../config/postgres-config');

const executeQueryWithParams = (query, params) => {
    console.log('Ejecutando query [' + query + '] con params [' + params + ']');
    return new Promise((resolve, reject) => {
        pool.connect().then((client) => {
            return client
                .query(query, params)
                .then((res) => {
                    client.release();
                    resolve(res);
                })
                .catch((err) => {
                    client.release();
                    reject(err);
                });
        });
    });
}

module.exports = { executeQueryWithParams };