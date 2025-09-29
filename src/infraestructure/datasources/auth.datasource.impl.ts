import { BcryptAdapter } from "../../config";
import { AppDataSource } from "../../data/postgres/data-source";
import { UserEntitySchema } from "../../data/postgres/entities/user.entity";
import { AuthDataSource, CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";
import { UserMapper } from "../mappers/user.mapper";

type HashFunction = (password: string) => string;
type CompareFunction = (password: string, hashed: string) => boolean;

export class AuthDatasourceImpl implements AuthDataSource {
  private readonly userRepository = AppDataSource.getRepository(UserEntitySchema);

  constructor(
    private readonly hashPassword: HashFunction = BcryptAdapter.hash,
    private readonly comparePassword: CompareFunction = BcryptAdapter.compare
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    const { name, email, password } = registerUserDto;

    try {
      // Buscar si ya existe
      const emailExist = await this.userRepository.findOne({ where: { email } });
      if (emailExist) throw CustomError.badRequest("email ya registrado");

      // Crear nuevo usuario
      const user = this.userRepository.create({
        name,
        email,
        password: this.hashPassword(password),
        role: [], // 👈 si quieres default vacío
      });

      await this.userRepository.save(user);

      return UserMapper.userEntityFromObject(user);

    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer("error de servidor");
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const { email, password } = loginUserDto;
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) throw CustomError.badRequest("User does not exist");

      const isMatching = this.comparePassword(password, user.password);
      if (!isMatching) throw CustomError.badRequest("Password is not valid");

      return UserMapper.userEntityFromObject(user);

    } catch (error) {
      console.log(error);
      throw CustomError.internalServer("error en el servidor");
    }
  }
}
