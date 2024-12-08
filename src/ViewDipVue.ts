import { createApp } from "vue";
import { IViewDip } from "@/IViewDip";
import App from './App.vue'
import { IAuthUserControllers } from "./controllers/interfaces/IAuthUserControllers";
import { registerPlugins } from '@/plugins'
import { IProductsControllers } from "./controllers/interfaces/IProductsControllers";
import { ICotacaoDollar } from "./models/services/ICotacaoDollar";
import { ISettingsControllers } from "./controllers/interfaces/ISettingsControllers";


export class ViewDipVue implements IViewDip{
    private authUserControllers:IAuthUserControllers
    private productsControllers:IProductsControllers
    private cotacaoDollarService:ICotacaoDollar
    private settingsControllers:ISettingsControllers
    
    constructor(authUserControllers:IAuthUserControllers, productsControllers:IProductsControllers,cotacaoDollarService:ICotacaoDollar,settingsControllers:ISettingsControllers){
        this.authUserControllers = authUserControllers
        this.productsControllers = productsControllers
        this.cotacaoDollarService = cotacaoDollarService
        this.settingsControllers = settingsControllers
    }
    run(): void {
        const app = createApp(App);
        app.provide<IAuthUserControllers>('authUserControllers', this.authUserControllers);
        app.provide<IProductsControllers>('productsControllers',this.productsControllers);
        app.provide<ICotacaoDollar>('cotacaoDollar', this.cotacaoDollarService);
        app.provide<ISettingsControllers>('settings',this.settingsControllers);
        
        registerPlugins(app)
        app.mount('#app')

    }
}