export class RedesSociais {
    id:string
    link_instagram:string
    link_youtube:string
    link_whatsapp:string

    constructor(id:string, link_instagram:string, link_youtube:string, link_whatsapp:string){
        this.id=id
        this.link_instagram = link_instagram
        this.link_youtube = link_youtube
        this.link_whatsapp = link_whatsapp
    }
}