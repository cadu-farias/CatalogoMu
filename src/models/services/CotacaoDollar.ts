import { ICotacaoDollar } from "./ICotacaoDollar";
import axios from 'axios';

export class CotacaoDollar implements ICotacaoDollar{

    async getDollarBrl(): Promise<string> {
        const response:any = await axios.get('https://economia.awesomeapi.com.br/last/USD-BRL');
        return response.data.USDBRL.bid
    }
    async converterBrlUSD(valor: number):Promise<number> {
        let dollar =  await this.getDollarBrl()
        let dollarConvert = Number(dollar)
        let dollarFinal = (valor / dollarConvert)
        return  dollarFinal + ((dollarFinal * 7 ) / 100)
    }

}