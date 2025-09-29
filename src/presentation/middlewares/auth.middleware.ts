import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config";
import { AppDataSource } from "../../data/postgres/data-source";
import { UserEntitySchema } from "../../data/postgres/entities/user.entity";

export class AuthMiddleware {
  static validateJWT = async (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.header("Authorization");
    if (!authorization) return res.status(400).json({ error: "No token provided" });

    // 👇 Ojo: tu condición estaba al revés
    if (!authorization.startsWith("Bearer ")) {
      return res.status(400).json({ error: "Invalid bearer token" });
    }

    const token = authorization.split(" ")[1] || "";

    try {
      const payload = await JwtAdapter.validateToken<{ id: string }>(token);
      if (!payload) return res.status(401).json({ error: "Invalid token" });

      // Buscar usuario con TypeORM Repository
      const userRepository = AppDataSource.getRepository(UserEntitySchema);
      const user = await userRepository.findOne({ where: { id: payload.id } });

      if (!user) return res.status(401).json({ error: "Invalid token - user not found" });

      // Guardar usuario en req.user (NO en req.body)
      req.user = user;

      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
