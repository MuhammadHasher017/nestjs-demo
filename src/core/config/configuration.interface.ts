import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export interface Configuration {
  postgres: {
    retryAttempts?: number;
    retryDelay?: number;
    autoLoadEntities?: boolean;
    keepConnectionAlive?: boolean;
  } & Partial<PostgresConnectionOptions>;

  port: number;
  baseUrl: string;
  hashNumber: string;
}
