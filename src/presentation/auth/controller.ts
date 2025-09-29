import { Request, Response } from "express";
import {
  AuthRepository,
  CustomError,
  LoginUser,
  LoginUserDto,
  RegisterUser,
  RegisterUserDto,
} from "../../domain";
import { JwtAdapter } from "../../config";
import { UserEntitySchema } from "../../data/postgres/entities/user.entity";
import { AppDataSource } from "../../data/postgres/data-source"; // tu DataSource de TypeORM

export class AuthController {
  private userRepository = AppDataSource.getRepository(UserEntitySchema);

  constructor(private readonly authRepository: AuthRepository) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  };

  registerUser = (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDto.create(req.body);
    if (error) return res.status(400).json({ error });

    new RegisterUser(this.authRepository)
      .execute(registerUserDto!)
      .then((data) => res.json(data))
      .catch((err) => this.handleError(err, res));
  };

  loginUser = (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDto.create(req.body);
    if (error) return res.status(400).json({ error });

    new LoginUser(this.authRepository)
      .execute(loginUserDto!)
      .then((data) => res.json(data))
      .catch((err) => this.handleError(err, res));
  };

  getUsers = async (req: Request, res: Response) => {
    try {
      const users = await this.userRepository.find();
      res.json({
  user: (req as any).user,
  users: users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
  })),
});
    } catch (error) {
      res.status(500).json({ error: "internal server error" });
    }
  };
}
