import { Products } from "../../entities/Products"

export interface IProductsRepository{
    createProduct(nome:string,img:string,video:string, valor:number, categoria_id:string,destaque?:boolean):Promise<Products>

    getAllProducts(key:string,updateCallback:(produtos:Products[])=>void):Promise<void>

    getProduct(id:string):Promise<Products | undefined>

    editProduct(produto:Products):Promise<void>

    stopListening(key?: string): void

    deleteProduct(id_prod:string):Promise<void>

}