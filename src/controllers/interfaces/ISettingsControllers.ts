import { Anuncio } from "@/models/entities/Anuncio"
import { Banners } from "@/models/entities/Banners"

export interface ISettingsControllers{
    createBanner(nome:string,imgDesktop:string,imgMobile:string,ativo:boolean):Promise<Banners>

    readBanner(updateCallback:(banners:Banners[])=>void):Promise<void>

    editBanner(id:string,nome:string,imgDesktop:string,imgMobile:string,ativo:boolean):Promise<void>

    deleteBanner(id:string):Promise<void>

    pararEscutadorBanner():void

    createAnuncio(img:string,ativo:boolean,direction:boolean,link:string):Promise<Anuncio>

    readAnuncio(updateCallback: (anuncios:Anuncio[])=> void):Promise<void>

    editAnuncio(id:string,img:string,ativo:boolean,direction:boolean,link:string):Promise<void>

    deleteAnuncio(id:string):Promise<void>

    pararEscutadorAnuncio():void
}