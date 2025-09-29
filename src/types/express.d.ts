import { UserEntitySchema } from "../data/postgres/entities/user.entity";

declare module "express-serve-static-core" {
  interface Request {
    user?: UserEntitySchema;
  }
}
