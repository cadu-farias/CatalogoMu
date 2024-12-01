import { User } from "../entities/User";

export interface IAuthService{
    criarUsuario(email:string,senha:string, nome:string):Promise<User | null>;
    entrarComEmailESenha(email:string,senha:string):Promise<User | null>;
    trocarSenha(email:string):void;
    onAuthStateChanged(callback: (user: User | null) => void): void;
    pegarId():string | null;
    sair():void;
}