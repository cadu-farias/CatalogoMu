export class Anuncio{
    id:string
    img:string
    ativo:boolean

    constructor(id:string,img:string, ativo:boolean){
        this.id = id
        this.img = img
        this.ativo = ativo
    }
}