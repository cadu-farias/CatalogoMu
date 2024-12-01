import { User } from "../../entities/User"

export interface IUserRepository {
    gravarUsuario(id:string, nome:string, email:string):void

    alterarNome(id:string, novoNome:string):void

    getUser(id:string):Promise<User | null>
}