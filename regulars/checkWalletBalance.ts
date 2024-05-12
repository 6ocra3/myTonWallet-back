import TonWeb from "tonweb";
import { Giveaways } from "../database/models/giveaways";
import { config } from "../config";
import { FLOAT } from "sequelize";

const tonweb = new TonWeb(new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC', {apiKey: config.apiKey}));
var utime = 0;


export async function getWalletTransactions(){
    try{
        const address = config.MAIN_ADDRESS
        const transactions = await tonweb.getTransactions(address);
        const newutime = transactions[0]?.utime | 0
    
        for(let i = 0; i<transactions.length;i++){
            const transcation = transactions[i]
    
            if(transcation.utime < utime){
                break
            }
    
            const comment = transcation.in_msg.message
            if(!Number(comment)){
                continue
            }
            const giveaway = (await Giveaways.findAll({
                where:{
                    id: comment,
                }
            }))[0]
    
            if(parseFloat(tonweb.utils.fromNano(transcation.in_msg.value)) < (giveaway.dataValues.amount * giveaway.dataValues.receiverCount)){
                continue
            }
    
            if(giveaway && giveaway.dataValues.status == "pending"){
                // @ts-ignore
                await giveaway.update({status: "active"})
            }
        }
    
        utime = newutime
    }  catch (error) {
        console.error('Ошибка при получении транзакций:', error);
        // Обработка ошибки или перезапуск операции
    }


}

