const mysql = require('mysql');
const sqlite3 = require('sqlite3');
const { sqlite } = require('../config.json');

let connection;
try {
  if (!sqlite) {
    connection = mysql.createConnection({
      host: process.env.MYSQL_HOSTNAME,
      user: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });
  }
} catch (error) {
  console.error("Błąd podczas tworzenia połączenia:", error);
}

const sendSingle = (query, params) => {
  if (sqlite) {
    return new Promise((resolve) => {
      const db = new sqlite3.Database('database.db');
    
      db.run(query, params, function (error) {
        if (error) {
          resolve({ status: error.code !== 'SQLITE_CONSTRAINT', errorCode: error.code, data: null });
        } else {
          db.all(query, params, (err, rows) => {
            if (err) {
              resolve({ status: err.code === 'SQLITE_CONSTRAINT', errorCode: err.code, data: null });
            } else {
              resolve({ status: true, data: rows });
            }
          });
        }
      });
    });
  } else {
    return new Promise(async (resolve) => {
      connection.query(query, params, (error, results) => {
        if (error) {
          resolve({ status: false, errorCode: error.code, data: null });
        } else {
          resolve({ status: true, data: results.length === 0 ? null : results });
        }
      });
    });
  }
};

const sendMulti = (queries) => {
  if (sqlite) {
    return new Promise((resolve) => {
      const db = new sqlite3.Database('database.db');
  
      db.serialize(() => {
        db.run('BEGIN TRANSACTION');
  
        const results = [];
        const queryPromises = queries.map((query) => {
          return new Promise((resolve) => {
            if (!query) {
              results.push({ status: false, data: null });
              resolve();
              return;
            }
  
            db.all(query, [], (error, queryResults) => {
              if (error) {
                console.error('Błąd zapytania:', error.code);
                results.push({ status: false, data: null });
                resolve();
              } else {
                results.push({ status: true, data: queryResults });
                resolve();
              }
            });
          });
        });
  
        Promise.all(queryPromises)
          .then(() => {
            db.run('COMMIT', (error) => {
              if (error) {
                console.error('Błąd zatwierdzenia transakcji:', error);
                resolve({ status: false });
              } else {
                resolve({ status: true, data: results });
              }
            });
          })
          .catch((error) => {
            console.error('Błąd wykonania zapytań:', error);
            db.run('ROLLBACK', () => {
              resolve({ status: false });
            });
          });
      });
    });
  } else {
    return new Promise((resolve) => {
      connection.beginTransaction((error) => {
        if (error) {
          console.error('Błąd rozpoczęcia transakcji:', error.code);
          resolve({ status: false });
        } else {
          const results = [];
          const queryPromises = queries.map((query) => {
            return new Promise((resolve) => {
              connection.query(query, (error, queryResults) => {
                if (error) {
                  console.error('Błąd zapytania:', error.code);
                  results.push({ status: false, data: null });
                  resolve();
                } else {
                  results.push({ status: true, data: queryResults });
                  resolve();
                }
              });
            });
          });
  
          Promise.all(queryPromises)
            .then(() => {
              connection.commit((error) => {
                if (error) {
                  console.error('Błąd zatwierdzenia transakcji:', error);
                  resolve({ status: false });
                } else {
                  resolve({ status: true, data: results });
                }
              });
            })
            .catch((error) => {
              console.error('Błąd wykonania zapytań:', error);
              connection.rollback(() => {
                resolve({ status: false });
              });
            });
        }
      });
    });
  }
};
module.exports = {
  sendSingle,
  sendMulti,
};