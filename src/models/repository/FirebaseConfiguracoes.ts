import { Anuncio } from "../entities/Anuncio";
import { Banners } from "../entities/Banners";
import { RedesSociais } from "../entities/RedesSociais";
import { IConfiguracoes } from "./interfaces/IConfiguracoes";
import { db } from "@/firebaseInit";
import {
    doc,
    updateDoc,
    deleteDoc,
    addDoc,
    collection,
    onSnapshot,
    query,
    getDocs
} from "firebase/firestore";

export class FirebaseConfiguracoes implements IConfiguracoes{

    private unsub:any = {}
    private unsubAnuncio:any = {}

    async createBanner(nome:string,imgDesktop: string, imgMobile: string, ativo: boolean): Promise<Banners> {
        const data =  await addDoc(collection(db,"Banners"),{
            nome:nome,
            imgDesktop:imgDesktop,
            imgMobile:imgMobile,
            ativo:ativo
        })

        return this.mapBanner(data.id,nome, imgDesktop, imgMobile, ativo)
    }
    async readBanner(updateCallback: (Banners:Banners[])=> void): Promise<void> {
        const q = query(collection(db, "Banners"));
        let banners: Banners[] = [];

        this.unsub = onSnapshot(q, (snapshot)=>{
            try{
                banners = []
                snapshot.forEach((item)=>{
                    banners.push(
                        {
                            id:item.id,
                            nome:item.data().nome,
                            imgDesktop: item.data().imgDesktop,
                            imgMobile:item.data().imgMobile,
                            ativo:item.data().ativo
                        }
                    )
                })
                
                updateCallback(banners);
                
            }catch(e){
                console.error(e)
            }
        })
    }

    stopListening(): void {
        if (this.unsub) {
            this.unsub(); 
        } else {
            console.warn("Nenhum listener ativo para remover.");
        }
    }

    async editBanner(id: string, nome:string, imgDesktop: string, imgMobile: string, ativo: boolean): Promise<void> {
        const docRef = doc(db,'Banners', id);
        await updateDoc(docRef,{
            nome:nome,
            imgDesktop:imgDesktop,
            imgMobile:imgMobile,
            ativo:ativo
        })
    }

    async deleteBanner(id: string): Promise<void> {
        const docRef = doc(db, "Banners",id)
        await deleteDoc(docRef)
    }
    async createAnuncio(img: string, ativo: boolean, direction:boolean, link:string): Promise<Anuncio> {
        const docRef = collection(db, "Anuncios")
        const anuncio = await addDoc(docRef,{
            img:img,
            ativo:ativo,
            direction:direction,
            link:link
        })
        return this.mapAnuncio(anuncio.id, img, ativo, direction,link)
        
    }
    async readAnuncio(updateCallback:(anuncio:Anuncio[]) => void): Promise<void> {
        const q = query(collection(db,"Anuncios"))
        let anuncios:Anuncio[] = []

        this.unsubAnuncio = onSnapshot(q, (snapshot)=>{
                try{
                anuncios = []
                snapshot.forEach((item)=>{
                    anuncios.push({
                        id:item.id,
                        img:item.data().img,
                        ativo:item.data().ativo,
                        direction:item.data().direction,
                        link:item.data().link
                    })
                })
                updateCallback(anuncios)
            }
            catch(e){
                console.error(e)
            }
        })
        
    }

    stopListeningAnuncio(): void {
        if (this.unsubAnuncio) {
            this.unsubAnuncio(); 
        } else {
            console.warn("Nenhum listener ativo para remover.");
        }
    }

    async editAnuncio(id: string, img: string, ativo: boolean, direction:boolean, link:string): Promise<void> {
        const docRef = doc(db,"Anuncios",id)
        await updateDoc(docRef,{
            img:img,
            ativo:ativo,
            direction:direction,
            link:link
        })
    }
    async deleteAnuncio(id: string): Promise<void> {
        const docRef = doc(db,"Anuncios", id)
        await deleteDoc(docRef)
    }
    
    mapBanner(id:string,nome:string,imgDesktop:string, imgMobile:string,ativo:boolean):Banners{
        return new Banners(id,nome, imgDesktop, imgMobile,ativo)
    }
    mapAnuncio(id:string,img:string,ativo:boolean, direction:boolean, link:string):Anuncio{
        return new Anuncio(id, img ,ativo, direction, link)
    }

    async createSocial(link_instagram: string, link_youtube: string, link_whatsapp: string): Promise<RedesSociais> {
        const docRef = collection(db, "RedesSociais")
        const anuncio = await addDoc(docRef,{
            link_instagram,
            link_youtube,
            link_whatsapp
        })
        return new RedesSociais(anuncio.id, link_instagram,link_youtube, link_whatsapp)
    }
    async readSocial(): Promise<RedesSociais> {
        const redesociais:RedesSociais = {
            id:'',
            link_instagram: '',
            link_youtube: '',
            link_whatsapp: ''
          }
        const querySnapshot = await getDocs(collection(db, "RedesSociais"));
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            redesociais.id = doc.id
            redesociais.link_instagram = doc.data().link_instagram
            redesociais.link_youtube = doc.data().link_youtube 
            redesociais.link_whatsapp = doc.data().link_whatsapp
          });
        return redesociais
    }
    async editSocial(id: string, link_instagram: string, link_youtube: string, link_whatsapp: string): Promise<void> {
        const docRef = doc(db,"RedesSociais",id)
        await updateDoc(docRef,{
            link_instagram,
            link_youtube,
            link_whatsapp
        })
    }
    async deleteSocial(id: string): Promise<void> {
        const docRef = doc(db,"RedesSociais", id)
        await deleteDoc(docRef)
    }

}