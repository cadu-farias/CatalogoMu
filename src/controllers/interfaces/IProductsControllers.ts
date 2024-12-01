import { CategoryProducts } from "@/models/entities/CategoryProducts";
import { Products } from "@/models/entities/Products"   
export interface IProductsControllers {
    cadastrarCategoria(nome:string):Promise<CategoryProducts>

    lerTodasCategorias(key:string,updateCallback:(categories:CategoryProducts[])=>void):Promise<void>

    stopListeningCategory(key: string): void

    editarCategoria(id:string, nome:string):Promise<void>

    deletarCategoria(id:string):Promise<void>

    createProduct(nome:string,img:string,video:string, valor:number, categoria_id:string,destaque?:boolean):Promise<Products>

    getAllProducts(key:string,updateCallback:(produtos:Products[])=>void):Promise<void>

    getProductId(id:string):Promise<Products | undefined>

    editProduct(produto:Products):Promise<void>

    stopListeningProducts(key?: string): void

    deleteProduct(id_prod:string):Promise<void>
}