import { CategoryProducts } from "../../entities/CategoryProducts";
export enum operador {
    adicionar = 1,
    diminuir = 2
}

export interface ICategoryProducts {

    createCategory(nome:string,index:number):Promise<CategoryProducts>

    getAllCategory(key:string,updateCallback:(categories:CategoryProducts[])=>void):Promise<void>

    getCategory(id:string):Promise<CategoryProducts>

    editCategory(id:string, nome:string,index:number):Promise<void>

    addCountProducts(id:string,operador:operador):Promise<void> 

    editCategoryLot(categories:CategoryProducts[]):Promise<void>

    stopListening(key?: string): void

    deleteCategory(id:string):Promise<void>

}