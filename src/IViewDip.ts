/**
 * Interface que define um contrato para classes que implementam a execução de uma visualização.
 * 
 * A interface `IViewDip` é utilizada para definir um método que deve ser implementado por qualquer
 * classe que deseja representar uma visualização ou operação que deve ser executada.
 */
export interface IViewDip {
    /**
     * Executa a lógica associada à visualização ou operação.
     * 
     * Este método é utilizado para iniciar ou executar uma ação específica em uma implementação da interface.
     * 
     * @returns {void}
     */
    run(): void;
}
