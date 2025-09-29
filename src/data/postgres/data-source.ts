import "reflect-metadata";
import { DataSource } from "typeorm";
import { UserEntitySchema } from "./entities/user.entity";
import { envs } from "../../config";

export const AppDataSource = new DataSource({
  type: "postgres",
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
});
