import { Banners } from "@/models/entities/Banners"
import { Anuncio } from "@/models/entities/Anuncio"
import { RedesSociais } from "@/models/entities/RedesSociais"

export interface IConfiguracoes{
    createBanner(nome:string,imgDesktop:string,imgMobile:string,ativo:boolean):Promise<Banners>

    readBanner(updateCallback:(banners:Banners[])=>void):Promise<void>

    editBanner(id:string,nome:string,imgDesktop:string,imgMobile:string,ativo:boolean):Promise<void>

    deleteBanner(id:string):Promise<void>

    stopListening():void

    stopListeningAnuncio(): void

    createAnuncio(img:string,ativo:boolean,direction:boolean,link:string):Promise<Anuncio>

    readAnuncio(updateCallback: (anuncios:Anuncio[])=> void):Promise<void>

    editAnuncio(id:string,img:string,ativo:boolean,direction:boolean,link:string):Promise<void>

    deleteAnuncio(id:string):Promise<void>

    createSocial(link_instagram:string,link_youtube:string,link_whatsapp:string):Promise<RedesSociais>

    readSocial():Promise<RedesSociais>

    editSocial(id:string,link_instagram:string,link_youtube:string,link_whatsapp:string):Promise<void>

    deleteSocial(id:string):Promise<void>
}