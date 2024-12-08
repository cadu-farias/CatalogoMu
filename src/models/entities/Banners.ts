export class Banners{
    id:string
    imgDesktop:string
    imgMobile:string
    ativo:boolean

    constructor(id:string, imgDesktop:string, imgMobile:string, ativo:boolean){
        this.id = id
        this.imgDesktop = imgDesktop
        this.imgMobile = imgMobile
        this.ativo = ativo
    }
}