export default () => ({
  api: {
    port: Number(process.env.API_PORT) || 3000,
  },
  database: {
    password: process.env.POSTGRES_PASSWORD || '',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 5432,
    name: process.env.POSTGRES_NAME || 'postgres',
    username: process.env.POSTGRES_USERNAME || 'postgres',
  },
});
