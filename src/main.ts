import { IAuthService } from "./models/services/IAuthService";
import { IAuthUserControllers } from "./controllers/interfaces/IAuthUserControllers";
import { IUserRepository } from "./models/repository/interfaces/IUserRepository";
import { FirebaseAuthService } from "@/models/services/FirebaseAuthService";
import { FirebaseUserRepository } from "@/models/repository/FirebaseUserRepository";
import { AuthUserControllers } from "@/controllers/AuthUserControllers";
import { ViewDipVue } from './ViewDipVue';
import { IViewDip } from './IViewDip';
import { ICategoryProducts } from "./models/repository/interfaces/ICategoryProducts";
import { FirebaseCategoryRepository } from "./models/repository/FirebaseCategoryRepository";
import { IProductsControllers } from "./controllers/interfaces/IProductsControllers";
import { ProductsControllers } from "./controllers/ProductsControllers";
import { IProductsRepository } from "./models/repository/interfaces/IProductsRepository";
import { FirebaseProductsRepository } from "./models/repository/FirebaseProductsRepository";
import { ICotacaoDollar } from "./models/services/ICotacaoDollar";
import { CotacaoDollar } from "./models/services/CotacaoDollar";
// Components

// Cria uma instância do serviço de autenticação Firebase
const authService: IAuthService = new FirebaseAuthService();

// Cria uma instância do repositório de usuários Firebase
const userRepository: IUserRepository = new FirebaseUserRepository();

// cria uma instancia do repositório de Categorias
const categoryRepository: ICategoryProducts = new FirebaseCategoryRepository();

const productsRepository: IProductsRepository = new FirebaseProductsRepository();

const cotacaoDollarService:ICotacaoDollar = new CotacaoDollar()
// Cria uma instancia do controlador de Produtos
const productsControllers : IProductsControllers = ProductsControllers.getInstance(categoryRepository, productsRepository)

// Cria uma instância do controlador de autenticação de usuários
const authUserControllers: IAuthUserControllers = new AuthUserControllers(authService, userRepository);

// Cria uma instância da visualização principal da aplicação
const viewDipVue: IViewDip = new ViewDipVue(authUserControllers, productsControllers, cotacaoDollarService);

// Executa a lógica da visualização principal
viewDipVue.run();