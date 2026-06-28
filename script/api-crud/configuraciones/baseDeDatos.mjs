import pg from 'pg'

const { Pool } = pg

const pool = new Pool({
    host:     process.env.DB_HOST     ?? 'localhost',
    user:     process.env.DB_USER     ?? 'postgres',
    password: process.env.DB_PASSWORD ?? '1234',
    port:     Number(process.env.DB_PORT ?? 5432),
    database: process.env.DB_NAME     ?? 'consultorio',
})

export default pool
