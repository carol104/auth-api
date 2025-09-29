import "reflect-metadata";
import { DataSource } from "typeorm";
import { UserEntitySchema } from "./entities/user.entity";
import { envs } from "../../config";

// Debug: Mostrar configuración de conexión
const config = {
  type: "postgres" as const,
  host: envs.DB_HOST,
  port: envs.DB_PORT,
  username: envs.DB_USER,
  password: envs.DB_PASS,
  database: envs.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [UserEntitySchema],
  migrations: [],
  subscribers: [],
};

console.log('📝 Configuración de TypeORM:', {
  ...config,
  password: config.password ? '********' : 'no password set' // No mostrar la contraseña real
});

export const AppDataSource = new DataSource(config);
