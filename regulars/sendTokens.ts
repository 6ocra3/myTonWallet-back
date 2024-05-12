import TonWeb from "tonweb";
import { TonClient, WalletContractV4, internal } from "@ton/ton";
import { mnemonicNew, mnemonicToPrivateKey } from "@ton/crypto";
import { config } from "../config";
import { Participants } from "../database/models/participants";
import { Giveaways } from "../database/models/giveaways";

const client = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey:  config.apiKey
});

export async function payToWinners(){
    try{
        const winners = await Participants.findAll({
            where:{
                status: "awaitingPayment"
            }
        })
    
        for(let i = 0; i<winners.length;i++){
            const prize = (await Giveaways.findByPk(winners[i].dataValues.giveawayId))?.dataValues.amount
            await sendTokens(winners[i].dataValues.receiverAddress, prize)
        }
    }   catch (error) {
        console.error(error)
    }


}

async function sendTokens(toAddress:string, value:string){
    try{
        let mnemonics = config.MAIN_ADDRESS_MNEMONICS.split(" ");
        let keyPair = await mnemonicToPrivateKey(mnemonics);
    
        let workchain = 0;
        let wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });
        let contract = client.open(wallet);
        
        let seqno: number = await contract.getSeqno();
        await contract.sendTransfer({
        seqno,
        secretKey: keyPair.secretKey,
        messages: [internal({
            value: value,
            to: toAddress,
            bounce: false
          })]
        });
    } catch (error) {
        console.error(error)
    }

}