export class Banners{
    id:string
    nome:string
    imgDesktop:string
    imgMobile:string
    ativo:boolean

    constructor(id:string,nome:string, imgDesktop:string, imgMobile:string, ativo:boolean){
        this.id = id
        this.nome = nome
        this.imgDesktop = imgDesktop
        this.imgMobile = imgMobile
        this.ativo = ativo
    }
}