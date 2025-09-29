import { Sign } from "crypto";
import { JwtAdapter } from "../../../config";
import { LoginUserDto } from "../../dtos/auth/login-user.dto";
import { CustomError } from "../../errors/custom.error";
import { AuthRepository } from "../../repositories/auth.repository";
import { SignOptions } from "jsonwebtoken";

interface UserToken{
token:string,
user:{
id:string,
name:string,
email:string;
    };

}


type SignToken =(payload: object, duration?:SignOptions["expiresIn"])=>Promise<string|null>


interface LoginUserUseCase {
    execute (loginUserDto: LoginUserDto): Promise<UserToken>;

}


export class LoginUser implements LoginUserUseCase{
constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken:SignToken = JwtAdapter.generateToken,
){

}



async  execute(loginUserDto: LoginUserDto): Promise<UserToken> {
const user = await this.authRepository.login(loginUserDto);
//const duration= SignOptions["expiresIn"]='2h';
const tokens = await this.signToken({id:user.id}, '2h')

if(!tokens) throw CustomError.internalServer('Error generation token');

        return {
             token: tokens,
            user:{
            id: user.id,
            name: user.name,
            email: user.email
            }
           
        }


    }
    
}