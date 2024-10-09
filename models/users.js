const pool = require("../database");

class Users {

    static async select({ username }) {
        let connection;
        try {
            connection = await pool.getConnection();
            let rows;
            if (username) {
                const query = `SELECT * FROM users WHERE username = ?`;
                [rows] = await connection.query(query, [username]);
            }

            return rows;
        } catch (error) {
            throw error;
        } finally {
            if (connection !== undefined) connection.release();
        }
    }
}

module.exports = Users;