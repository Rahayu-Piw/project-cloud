const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
async function connectDB() {
    return open({
        filename: './database.db',
        driver: sqlite3.Database
    });
}
module