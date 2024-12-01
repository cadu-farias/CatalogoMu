export interface ICotacaoDollar{
    getDollarBrl():Promise<string>

    converterBrlUSD(valor:number):Promise<number>

}