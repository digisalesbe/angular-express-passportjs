// Load environment variables
require('dotenv').config();

// Function to initialize database connection
async function initializeDatabase() {
    // DATABASE_TYPE defined in the .env file
    const dbType = process.env.DATABASE_TYPE;

    // If type is mongoDB
    if (dbType === 'mongodb') {
        const mongoose = require('mongoose');
        // Connect to MongoDB
        const mongoUri = process.env.MONGO_URI;
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');
    } // if type is MySQL or MariaDB
    else if (dbType === 'mysql' || dbType === 'mariadb') {
        // Common SQL configuration
        const config = {
            host: process.env.SQL_HOST,
            port: process.env.SQL_PORT,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE
        };

        // Different database connection for MySQL and MariaDB but same config variables
        if (dbType === 'mysql') {
            const mysql = require('mysql2/promise');
            // Connect to MySQL
            const connection = await mysql.createConnection(config);
            console.log('Connected to MySQL');
            return connection;
        } else if (dbType === 'mariadb') {
            const mariadb = require('mariadb');
            // Connect to MariaDB
            const pool = mariadb.createPool(config);
            const connection = await pool.getConnection();
            console.log('Connected to MariaDB');
            return connection;
        }
    } else {
        throw new Error(`Unsupported database type: ${dbType}`);
    }
}

// Initialize the database connection
initializeDatabase().catch(err => console.error('Database connection failed:', err));
