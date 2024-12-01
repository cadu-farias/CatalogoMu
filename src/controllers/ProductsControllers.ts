import { CategoryProducts } from "@/models/entities/CategoryProducts";
import { IProductsControllers } from "./interfaces/IProductsControllers";
import { ICategoryProducts } from "@/models/repository/interfaces/ICategoryProducts";
import { FirebaseCategoryRepository } from "@/models/repository/FirebaseCategoryRepository";
import { Products } from "@/models/entities/Products";
import { IProductsRepository } from "@/models/repository/interfaces/IProductsRepository";
import { FirebaseProductsRepository } from "@/models/repository/FirebaseProductsRepository";

export class ProductsControllers implements IProductsControllers{

    private static instance: ProductsControllers | null = null

    private categoryRepository: ICategoryProducts = new FirebaseCategoryRepository();
    private productsRepository: IProductsRepository = new FirebaseProductsRepository();

    private constructor(categoryRepository: ICategoryProducts, productsRepository:IProductsRepository){
        this.categoryRepository = categoryRepository
        this.productsRepository = productsRepository
    }
    stopListeningProducts(key?: string): void {
        this.productsRepository.stopListening(key)
    }
    async createProduct(nome: string, img: string, video: string, valor: number, categoria_id: string, destaque?: boolean): Promise<Products> {
       return await this.productsRepository.createProduct(nome, img, video, valor, categoria_id, destaque)
    }
    async getAllProducts(key: string, updateCallback: (produtos: Products[]) => void): Promise<void> {
        await this.productsRepository.getAllProducts(key,updateCallback)
    }

    async getProductId(id: string): Promise<Products | undefined> {
        return await this.productsRepository.getProduct(id)
    }

    async editProduct(produto: Products): Promise<void> {
        await this.productsRepository.editProduct(produto)
    }
    async deleteProduct(id_prod: string): Promise<void> {
        await this.productsRepository.deleteProduct(id_prod)
    }

    static getInstance(categoryRepository: ICategoryProducts, productsRepository:IProductsRepository):ProductsControllers{
        if(!ProductsControllers.instance){
            ProductsControllers.instance = new ProductsControllers(categoryRepository, productsRepository)
        }
        return ProductsControllers.instance;
    }


    async cadastrarCategoria(nome: string): Promise<CategoryProducts>{
        return await this.categoryRepository.createCategory(nome)
    }
    async lerTodasCategorias(key: string, updateCallback:(categories:CategoryProducts[])=>void): Promise<void> {
        await this.categoryRepository.getAllCategory(key, updateCallback)
    }
    stopListeningCategory(key: string): void {
        this.categoryRepository.stopListening(key)
    }
    async editarCategoria(id: string, nome: string): Promise<void> {
        await this.categoryRepository.editCategory(id,nome)
    }
    async deletarCategoria(id: string): Promise<void> {
        await this.categoryRepository.deleteCategory(id)
    }

}