import { User } from "../../models/entities/User";

/**
 * Interface que define os métodos para o controlador de autenticação de usuários.
 */
export interface IAuthUserControllers {
    /**
     * Retorna o identificador do usuário autenticado.
     * 
     * @returns {string | null} - O identificador único do usuário ou `null` se nenhum usuário estiver autenticado.
     */
    getIdUser(): string | null;

    /**
     * Recupera um usuário com base no identificador fornecido.
     * 
     * @param {string} id - O identificador único do usuário.
     * @returns {Promise<User | null>} - Um `Promise` que resolve com o usuário encontrado ou `null` se o usuário não for encontrado.
     */
    getUserId(id: string): Promise<User | null>;

    /**
     * Cadastra um novo usuário com email, senha e nome.
     * 
     * @param {string} email - O endereço de email do usuário.
     * @param {string} senha - A senha do usuário.
     * @param {string} nome - O nome do usuário.
     * @returns {Promise<User | null>} - Um `Promise` que resolve com o usuário cadastrado ou `null` se o cadastro falhar.
     */
    cadastrarUsuario(email: string, senha: string, nome: string): Promise<User | null>;

    /**
     * Realiza o login de um usuário com email e senha.
     * 
     * @param {string} email - O endereço de email do usuário.
     * @param {string} senha - A senha do usuário.
     * @returns {Promise<User | null>} - Um `Promise` que resolve com o usuário autenticado ou `null` se a autenticação falhar.
     */
    entrarComEmailESenha(email: string, senha: string): Promise<User | null>;

    onAuthStateChanged(callback: (user: User | null) => void): void;
    /**
     * Envia um email para recuperação de senha para o endereço de email fornecido.
     * 
     * @param {string} email - O endereço de email do usuário.
     * @returns {void}
     */
    enviarEmailDeRecuperacao(email: string): void;

    /**
     * Realiza o logout do usuário autenticado.
     * 
     * @returns {void}
     */
    deslogar(): void;
}
