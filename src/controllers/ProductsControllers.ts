import { CategoryProducts } from "@/models/entities/CategoryProducts";
import { IProductsControllers } from "./interfaces/IProductsControllers";
import { ICategoryProducts, operador } from "@/models/repository/interfaces/ICategoryProducts";
import { Products } from "@/models/entities/Products";
import { IProductsRepository } from "@/models/repository/interfaces/IProductsRepository";

export class ProductsControllers implements IProductsControllers{

    private static instance: ProductsControllers | null = null

    private categoryRepository: ICategoryProducts | null = null
    private productsRepository: IProductsRepository | null = null

    private constructor(categoryRepository: ICategoryProducts, productsRepository:IProductsRepository){
        this.categoryRepository = categoryRepository
        this.productsRepository = productsRepository
    }

    static getInstance(categoryRepository: ICategoryProducts, productsRepository:IProductsRepository):ProductsControllers{
        if(!ProductsControllers.instance){
            ProductsControllers.instance = new ProductsControllers(categoryRepository, productsRepository)
        }
        return ProductsControllers.instance;
    }

    stopListeningProducts(key?: string): void {
        if (!this.productsRepository) {
            throw new Error("Configurações não definidas. Não é possível continuar");
        }
        this.productsRepository.stopListening(key)
    }
    async createProduct(nome: string, img: string, video: string, valor: number, categoria_id: string, destaque?: boolean): Promise<Products> {
        if (!this.productsRepository) {
            throw new Error("Configurações não definidas. Não é possível continuar");
        }
        this.addCountProducts(categoria_id,1)
        return await this.productsRepository.createProduct(nome, img, video, valor, categoria_id, destaque)
    }
    async getAllProducts(key: string, updateCallback: (produtos: Products[]) => void): Promise<void> {
        if (!this.productsRepository) {
            throw new Error("Configurações não definidas. Não é possível continuar");
        }
        await this.productsRepository.getAllProducts(key,updateCallback)
    }

    async getProductId(id: string): Promise<Products | undefined> {
        if (!this.productsRepository) {
            throw new Error("Configurações não definidas. Não é possível continuar");
        }
        return await this.productsRepository.getProduct(id)
    }

    async editProduct(produto: Products): Promise<void> {
        if (!this.productsRepository) {
            throw new Error("Configurações não definidas. Não é possível continuar");
        }
        await this.productsRepository.editProduct(produto)
    }
    async deleteProduct(id_prod: string): Promise<void> {
        if (!this.productsRepository) {
            throw new Error("Configurações não definidas. Não é possível continuar");
        }
        await this.productsRepository.deleteProduct(id_prod)
    }

    

    async cadastrarCategoria(nome: string, index:number): Promise<CategoryProducts>{
        if (!this.categoryRepository) {
            throw new Error("Configurações não definidas. Não é possível continuar");
        }
        return await this.categoryRepository.createCategory(nome,index)
    }
    async lerTodasCategorias(key: string, updateCallback:(categories:CategoryProducts[])=>void): Promise<void> {
        if (!this.categoryRepository) {
            throw new Error("Configurações não definidas. Não é possível continuar");
        }
        await this.categoryRepository.getAllCategory(key, updateCallback)
    }

    async lerCategoria(id: string): Promise<CategoryProducts> {
        if (!this.categoryRepository) {
            throw new Error("Configurações não definidas. Não é possível continuar");
        }
        return await this.categoryRepository.getCategory(id)
    }

    stopListeningCategory(key: string): void {
        if (!this.categoryRepository) {
            throw new Error("Configurações não definidas. Não é possível continuar");
        }
        this.categoryRepository.stopListening(key)
    }
    async editarCategoria(id: string, nome: string, index:number): Promise<void> {
        if (!this.categoryRepository) {
            throw new Error("Configurações não definidas. Não é possível continuar");
        }
        await this.categoryRepository.editCategory(id,nome,index)
    }

    async addCountProducts(id: string, operador: operador): Promise<void> {
        if (!this.categoryRepository) {
            throw new Error("Configurações não definidas. Não é possível continuar");
        }
        await this.categoryRepository.addCountProducts(id,operador)
    }

    async editarCategoriaLote(categorias:CategoryProducts[]):Promise<void>{
        if (!this.categoryRepository) {
            throw new Error("Configurações não definidas. Não é possível continuar");
        }
        await this.categoryRepository.editCategoryLot(categorias)
    }
    async deletarCategoria(id: string): Promise<object> {
        const categoria = await this.lerCategoria(id)
        if(categoria.countProducts != undefined && categoria.countProducts > 0){
            return {title:"Não foi possivel deletar", text:"Esta categoria possui produtos vinculados a ela", type:"error"}
        }else{
            if (!this.categoryRepository) {
                throw new Error("Configurações não definidas. Não é possível continuar");
            }
            await this.categoryRepository.deleteCategory(id)
            return {title:"Sucesso", text:"Categoria deletada com sucesso!", type:"success"}
        }
    }

}