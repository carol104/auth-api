import { AuthDataSource, AuthRepository, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";

export class AuthRepositoryImpl implements AuthRepository{
   
   constructor(private readonly authDataSource: AuthDataSource,){
    
   }
   
    register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    return this.authDataSource.register(registerUserDto);
    }

    login(loginUserDto:LoginUserDto):Promise<UserEntity>{
        return this.authDataSource.login(loginUserDto);
    }
    
}