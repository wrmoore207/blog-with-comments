// Import the PostgreSQL client
import {Pool} from "pg";

// Create a connection pool (this handles database connections eficientyly)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Load the database URL from environmen variables
    ssl: {
        rejectUnauthorized: false, // Required for Neon
    },
});

// Function to query the database
export async function query(text: string, params?: any[]){
    const client = await pool.connect();
    try{
        const res = await client.query(text, params);
        return res.rows;
    }   finally {
        client.release();
    }
}

export default pool;