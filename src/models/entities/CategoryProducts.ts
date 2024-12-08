export class CategoryProducts {
    id_category:string;
    nome:string;
    index:number;
    countProducts?:number;

    constructor(id_category:string,nome:string,index:number, countProducts?:number){
        this.id_category = id_category
        this.nome = nome
        this.index = index
        this.countProducts = countProducts
    }
    
}