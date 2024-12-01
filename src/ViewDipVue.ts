import { createApp } from "vue";
import { IViewDip } from "@/IViewDip";
import App from './App.vue'
import { IAuthUserControllers } from "./controllers/interfaces/IAuthUserControllers";
import { registerPlugins } from '@/plugins'
import { IProductsControllers } from "./controllers/interfaces/IProductsControllers";
import { ICotacaoDollar } from "./models/services/ICotacaoDollar";


export class ViewDipVue implements IViewDip{
    private authUserControllers:IAuthUserControllers
    private productsControllers:IProductsControllers
    private cotacaoDollarService:ICotacaoDollar
    
    constructor(authUserControllers:IAuthUserControllers, productsControllers:IProductsControllers,cotacaoDollarService:ICotacaoDollar){
        this.authUserControllers = authUserControllers
        this.productsControllers = productsControllers
        this.cotacaoDollarService = cotacaoDollarService
    }
    run(): void {
        const app = createApp(App);
        app.provide<IAuthUserControllers>('authUserControllers', this.authUserControllers);
        app.provide<IProductsControllers>('productsControllers',this.productsControllers);
        app.provide<ICotacaoDollar>('cotacaoDollar', this.cotacaoDollarService);
        
        registerPlugins(app)
        app.mount('#app')

    }
}