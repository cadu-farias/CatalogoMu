export class Products {
    id_prod:string;
    nome:string;
    img:string;
    video: string;
    valor:number;
    categoria_id:string;
    destaque?:boolean;

    constructor(id:string, nome:string,img:string,video:string,valor:number,categoria_id:string,destaque?:boolean){
        this.id_prod = id
        this.nome = nome
        this.img = img
        this.video = video
        this.valor = valor
        this.categoria_id = categoria_id
        this.destaque = destaque
    }

    

}