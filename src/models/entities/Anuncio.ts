export class Anuncio{
    id:string
    img:string
    ativo:boolean
    direction:boolean
    link: string

    constructor(id:string,img:string, ativo:boolean, direction:boolean, link:string){
        this.id = id
        this.img = img
        this.ativo = ativo
        this.direction = direction
        this.link = link
    }
}