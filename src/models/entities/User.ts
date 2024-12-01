export class User {
    id: string;
    nome: string;
    email:string;
    
    constructor(id:string,email:string, nome:string){
        this.id = id;
        this.nome = nome;
        this.email = email
    }

    
}