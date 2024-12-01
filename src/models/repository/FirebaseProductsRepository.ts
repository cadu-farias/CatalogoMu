import { Products } from "../entities/Products";
import { IProductsRepository } from "./interfaces/IProductsRepository";
import { db } from "@/firebaseInit";
import {
    doc,
    updateDoc,
    deleteDoc,
    addDoc,
    collection,
    onSnapshot,
    query,
    getDoc
} from "firebase/firestore";

export class FirebaseProductsRepository implements IProductsRepository{
    private unsubscribeFns: { [key: string]: () => void } = {}; // Mapeia ouvintes por chave
    
    
    async getProduct(id: string): Promise<Products | undefined> {
        // Crie uma referência para o documento
        const docRef = doc(db, "Products", id);
        
        // Busque o documento com o id especificado
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            // Acessar o único documento retornado (se houver)
            const doc = docSnap // Primeiro documento
            console.log(doc.id, "=>", doc.data());
            return this.mapProductsFirebase(doc.id, doc.data().nome, doc.data().img, doc.data().video, doc.data().valor, doc.data().categoria_id, doc.data().destaque)
          }
    }
    async createProduct(nome: string, img: string, video: string, valor: number, categoria_id: string, destaque?: boolean): Promise<Products> {
        const produtosRef = await addDoc(collection(db, "Products"), {
            nome: nome,
            img: img, 
            video: video, 
            valor: valor, 
            categoria_id: categoria_id, 
            destaque: destaque
        });
        return this.mapProductsFirebase(produtosRef.id, nome,img,video,valor,categoria_id,destaque)
    }
    async getAllProducts(
        key: string,
        updateCallback: (produtos: Products[]) => void
    ): Promise<void> {
        console.log('updateCallback:', updateCallback);
        const q = query(collection(db, "Products"));
        let produtos: Products[] = []; // Tipando corretamente como CategoryProducts[]
    
        return new Promise((resolve, reject) => {
            if (this.unsubscribeFns[key]) {
                this.unsubscribeFns[key](); // Cancela o ouvinte anterior
            }
    
            this.unsubscribeFns[key] = onSnapshot(
                q,
                (querySnapshot) => {
                    try {
                        produtos = [];
                        querySnapshot.forEach((doc) => {
                            produtos.push({
                                id_prod: doc.id,
                                nome: doc.data().nome,
                                img: doc.data().img, 
                                video: doc.data().video, 
                                valor: doc.data().valor, 
                                categoria_id: doc.data().categoria_id, 
                                destaque: doc.data().destaque
                            });
                        });
    
                        if (typeof updateCallback === 'function') {
                            updateCallback(produtos); // Verifica se é uma função antes de chamar
                        } else {
                            console.error('updateCallback is not a function');
                        }
    
                        resolve(); // Resolve sem retornar o valor
                    } catch (error) {
                        reject(error);
                    }
                }
            );
        });
    }
    async editProduct(produto:Products): Promise<void> {
        const produtoRef = doc(db, "Products", produto.id_prod);
        await updateDoc(produtoRef, {
            nome: produto.nome,
            img: produto.img, 
            video: produto.video, 
            valor: produto.valor, 
            categoria_id: produto.categoria_id, 
            destaque: produto.destaque
          });
    }
    stopListening(key: string): void {
        if (this.unsubscribeFns[key]) {
            this.unsubscribeFns[key](); // Cancela o ouvinte para a chave específica
            delete this.unsubscribeFns[key]; // Remove o ouvinte do registro
        }
    }
    async deleteProduct(id_prod: string): Promise<void> {
        await deleteDoc(doc(db, "Products", id_prod));
    }

    mapProductsFirebase(id:string, nome:string,img: string, video: string, valor: number, categoria_id: string, destaque?: boolean):Products{
        return new Products(
            id,
            nome,
            img, 
            video, 
            valor, 
            categoria_id, 
            destaque
        )
    }

}