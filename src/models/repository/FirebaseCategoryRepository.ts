import { CategoryProducts } from "../entities/CategoryProducts";
import { ICategoryProducts } from "./interfaces/ICategoryProducts";
import { db } from "@/firebaseInit";
import {
    doc,
    updateDoc,
    deleteDoc,
    addDoc,
    collection,
    onSnapshot,
    query
} from "firebase/firestore";

export class FirebaseCategoryRepository implements ICategoryProducts {
    private unsubscribeFns: { [key: string]: () => void } = {}; // Mapeia ouvintes por chave

    async createCategory(nome: string): Promise<CategoryProducts> {
        const categoryRef = await addDoc(collection(db, "CategoryProducts"), {
            nome: nome,
        });
        return this.mapCategoryFirebase(categoryRef.id, nome)
    }

    async getAllCategory(
        key: string,
        updateCallback: (categories: CategoryProducts[]) => void
    ): Promise<void> {
        console.log('updateCallback:', updateCallback);
        const q = query(collection(db, "CategoryProducts"));
        let categories: CategoryProducts[] = []; // Tipando corretamente como CategoryProducts[]
    
        return new Promise((resolve, reject) => {
            if (this.unsubscribeFns[key]) {
                this.unsubscribeFns[key](); // Cancela o ouvinte anterior
            }
    
            this.unsubscribeFns[key] = onSnapshot(
                q,
                (querySnapshot) => {
                    try {
                        categories = [];
                        querySnapshot.forEach((doc) => {
                            categories.push({
                                id_category: doc.id,
                                nome: doc.data().nome,
                            });
                        });
    
                        if (typeof updateCallback === 'function') {
                            updateCallback(categories); // Verifica se é uma função antes de chamar
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
    

    stopListening(key: string): void {
        if (this.unsubscribeFns[key]) {
            this.unsubscribeFns[key](); // Cancela o ouvinte para a chave específica
            delete this.unsubscribeFns[key]; // Remove o ouvinte do registro
        }
    }

    async editCategory(id: string, nome:string): Promise<void> {
        const categoryRef = doc(db, "CategoryProducts", id);
        await updateDoc(categoryRef, {
            nome: nome
          });
    }

    async deleteCategory(id: string): Promise<void> {
        await deleteDoc(doc(db, "CategoryProducts", id));
    }

    mapCategoryFirebase(id:string, nome:string):CategoryProducts{
        return new CategoryProducts(
            id,
            nome
        )
    }
}
