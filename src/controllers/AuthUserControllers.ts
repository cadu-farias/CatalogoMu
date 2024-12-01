import { User } from "../models/entities/User";
import { IUserRepository } from "../models/repository/interfaces/IUserRepository";
import { IAuthService } from "../models/services/IAuthService";
import { IAuthUserControllers } from "./interfaces/IAuthUserControllers";

/**
 * Controlador responsável por gerenciar a autenticação e manipulação de usuários.
 * 
 * Esta classe implementa a interface `IAuthUserControllers` e utiliza serviços de autenticação e
 * repositório de usuários para fornecer funcionalidades de gerenciamento de usuários.
 */
export class AuthUserControllers implements IAuthUserControllers {

    private authService: IAuthService;
    private userRepository: IUserRepository;

    /**
     * Construtor da classe `AuthUserControllers`.
     * 
     * @param {IAuthService} authService - Serviço de autenticação utilizado para operações de login, logout e gerenciamento de usuários.
     * @param {IUserRepository} userRepository - Repositório utilizado para persistir e recuperar dados dos usuários.
     */
    constructor(authService: IAuthService, userRepository: IUserRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }
    onAuthStateChanged(callback: (user: User | null) => void): void {
        this.authService.onAuthStateChanged(callback);
    }
    
    /**
     * Retorna o identificador do usuário autenticado.
     * 
     * @returns {string | null} - O identificador único do usuário ou `null` se nenhum usuário estiver autenticado.
     */
    getIdUser(): string | null {
        return this.authService.pegarId();
    }

    /**
     * Recupera um usuário com base no identificador fornecido.
     * 
     * @param {string} id - O identificador único do usuário.
     * @returns {Promise<User | null>} - Um `Promise` que resolve com o usuário encontrado ou `null` se o usuário não for encontrado.
     */
    async getUserId(id: string): Promise<User | null> {
        return await this.userRepository.getUser(id);
    }

    /**
     * Cadastra um novo usuário com email, senha e nome.
     * 
     * @param {string} email - O endereço de email do usuário.
     * @param {string} senha - A senha do usuário.
     * @param {string} nome - O nome do usuário.
     * @returns {Promise<User | null>} - Um `Promise` que resolve com o usuário cadastrado ou `null` se o cadastro falhar.
     */
    async cadastrarUsuario(email: string, senha: string, nome: string): Promise<User | null> {
        const newUser = await this.authService.criarUsuario(email, senha, nome);
        if (newUser != null) {
            await this.userRepository.gravarUsuario(newUser.id, newUser.nome, newUser.email);
            return newUser;
        }
        return null;
    }

    /**
     * Realiza o login de um usuário com email e senha.
     * 
     * @param {string} email - O endereço de email do usuário.
     * @param {string} senha - A senha do usuário.
     * @returns {Promise<User | null>} - Um `Promise` que resolve com o usuário autenticado e seus dados ou `null` se a autenticação falhar.
     */
    async entrarComEmailESenha(email: string, senha: string): Promise<User | null> {
        const user = await this.authService.entrarComEmailESenha(email, senha);
        if (user?.id == undefined) {
            return null;
        }
        const userLogado = await this.userRepository.getUser(user.id);
        return userLogado;
    }

    /**
     * Envia um email para recuperação de senha para o endereço de email fornecido.
     * 
     * @param {string} email - O endereço de email do usuário.
     * @returns {void}
     */
    enviarEmailDeRecuperacao(email: string): void {
        this.authService.trocarSenha(email);
    }

    /**
     * Realiza o logout do usuário autenticado.
     * 
     * @returns {Promise<void>}
     */
    async deslogar(): Promise<void> {
        await this.authService.sair();
    }

}
