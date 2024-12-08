import { Anuncio } from "../entities/Anuncio";
import { Banners } from "../entities/Banners";
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
} from "firebase/firestore";

export class FirebaseConfiguracoes implements IConfiguracoes{

    private unsub:any = {}
    private unsubAnuncio:any = {}

    async createBanner(imgDesktop: string, imgMobile: string, ativo: boolean): Promise<Banners> {
        const data =  await addDoc(collection(db,"Banners"),{
            imgDesktop:imgDesktop,
            imgMobile:imgMobile,
            ativo:ativo
        })

        return this.mapBanner(data.id, imgDesktop, imgMobile, ativo)
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

    async editBanner(id: string, imgDesktop: string, imgMobile: string, ativo: boolean): Promise<void> {
        const docRef = doc(db,'Banners', id);
        await updateDoc(docRef,{
            imgDesktop:imgDesktop,
            imgMobile:imgMobile,
            ativo:ativo
        })
    }

    async deleteBanner(id: string): Promise<void> {
        const docRef = doc(db, "Banners",id)
        await deleteDoc(docRef)
    }
    async createAnuncio(img: string, ativo: boolean): Promise<Anuncio> {
        const docRef = collection(db, "Anuncios")
        const anuncio = await addDoc(docRef,{
            img:img,
            ativo:ativo
        })
        return this.mapAnuncio(anuncio.id, img, ativo)
        
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
                        ativo:item.data().ativo
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

    async editAnuncio(id: string, img: string, ativo: boolean): Promise<void> {
        const docRef = doc(db,"Anuncios",id)
        await updateDoc(docRef,{
            img:img,
            ativo:ativo
        })
    }
    async deleteAnuncio(id: string): Promise<void> {
        const docRef = doc(db,"Anuncios", id)
        await deleteDoc(docRef)
    }
    
    mapBanner(id:string,imgDesktop:string, imgMobile:string,ativo:boolean):Banners{
        return new Banners(id, imgDesktop, imgMobile,ativo)
    }
    mapAnuncio(id:string,img:string,ativo:boolean):Anuncio{
        return new Anuncio(id, img ,ativo)
    }

}