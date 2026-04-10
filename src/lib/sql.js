import mysql from 'mysql2/promise';
import log from 'xac-loglevel';

const connection = await mysql.createConnection({
  host: process.env.SENOTYPE_DB_HOST,
  user: process.env.SENOTYPE_DB_USER,
  database: process.env.SENOTYPE_DB_NAME,
  password: process.env.SENOTYPE_DB_PWD,
});

const SQL = {
  exec: async (q, values) => {
    try {
      log.debug('SQL.exec', q);
      const [results] = await connection.query(q, values);
      return results;
    } catch (err) {
      log.error('Error.SQL.exec', err);
    }
  },
};

export default SQL;
