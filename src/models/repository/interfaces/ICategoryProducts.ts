import { CategoryProducts } from "../../entities/CategoryProducts";

export interface ICategoryProducts {

    createCategory(nome:string):Promise<CategoryProducts>

    getAllCategory(key:string,updateCallback:(categories:CategoryProducts[])=>void):Promise<void>

    editCategory(id:string, nome:string):Promise<void>

    stopListening(key?: string): void

    deleteCategory(id:string):Promise<void>

}