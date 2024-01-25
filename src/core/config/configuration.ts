import { Configuration } from './configuration.interface';

export default (): Configuration => {
  return {
    // whitelist: ['api'],

    postgres: {
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT) || 5432,
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      "entities": ["dist/**/*.entity{.ts,.js}"],
      synchronize: true,
      // cache: { duration: 10000, type: 'database' },
      schema: 'public',
    },

    port: Number(process.env.PORT) || 3000,
    baseUrl: process.env.BASE_URL,
    hashNumber: process.env.HASH_NUMBER,
  };
};
