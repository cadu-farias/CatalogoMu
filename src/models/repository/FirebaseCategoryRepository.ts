import { CategoryProducts } from "../entities/CategoryProducts";
import { ICategoryProducts, operador } from "./interfaces/ICategoryProducts";
import { db } from "@/firebaseInit";
import {
    doc,
    updateDoc,
    deleteDoc,
    addDoc,
    collection,
    onSnapshot,
    query,
    orderBy,
    writeBatch,
    increment,
    getDoc
} from "firebase/firestore";

export class FirebaseCategoryRepository implements ICategoryProducts {
    private unsubscribeFns: { [key: string]: () => void } = {}; // Mapeia ouvintes por chave

    async createCategory(nome: string, index:number,countProducts = 0): Promise<CategoryProducts> {
        const categoryRef = await addDoc(collection(db, "CategoryProducts"), {
            nome: nome,
            index:index,
            countProducts:countProducts
        });
        return this.mapCategoryFirebase(categoryRef.id, nome,index,countProducts)
    }

    async getCategory(id: string): Promise<CategoryProducts> {
        try {
          // Referência ao documento
          const docRef = doc(db, "CategoryProducts", id);
      
          // Obtém o snapshot do documento
          const docSnapshot = await getDoc(docRef);
      
          if (!docSnapshot.exists()) {
            // Lança erro caso o documento não exista
            throw new Error(`Categoria com ID ${id} não encontrada.`);
          }
      
          // Obtém os dados do documento
          const data = docSnapshot.data();
      
          // Verifica se os campos necessários existem
          if (!data || typeof data.nome !== "string" || typeof data.index !== "number" || typeof data.countProducts !== "number") {
            throw new Error(`Dados inválidos para a categoria com ID ${id}.`);
          }
      
          // Mapeia para a entidade CategoryProducts
          return this.mapCategoryFirebase(id, data.nome, data.index, data.countProducts);
        } catch (error) {
          console.error("Erro ao buscar categoria:", error);
          throw error; // Relança o erro para que possa ser tratado onde a função for chamada
        }
      }

    async getAllCategory(
        key: string,
        updateCallback: (categories: CategoryProducts[]) => void
    ): Promise<void> {

        const q = query(collection(db, "CategoryProducts"), orderBy('index'));
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
                                index:doc.data().index,
                                countProducts:doc.data().countProducts
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

    async editCategory(id: string, nome:string, index:number): Promise<void> {
        const categoryRef = doc(db, "CategoryProducts", id);
        await updateDoc(categoryRef, {
            nome: nome,
            index:index
          });
    }

    async editCategoryLot(categories:CategoryProducts[]):Promise<void>{
        const batch = writeBatch(db)

        categories.forEach((categoria)=>{
            const docRef = doc(db,"CategoryProducts", categoria.id_category);
            batch.update(docRef, {index: categoria.index})
        })
        try {
            await batch.commit();
          } catch (error) {
            throw error;
          }
    }

    async addCountProducts(id: string,operador: operador): Promise<void> {
        const categoryRef = doc(db, "CategoryProducts", id);
        if (operador == 1){
            await updateDoc(categoryRef, {
                countProducts:increment(1)
              });
        }else if (operador == 2 ){
            await updateDoc(categoryRef,
                {
                    countProducts:increment(-1)
                }
            )
        }
    }
    async deleteCategory(id: string): Promise<void> {
        await deleteDoc(doc(db, "CategoryProducts", id));
    }

    mapCategoryFirebase(id:string, nome:string,index:number, countProducts?:number):CategoryProducts{
        return new CategoryProducts(
            id,
            nome,
            index,
            countProducts
        )
    }
}
