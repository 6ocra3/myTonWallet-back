import { Model } from "sequelize"
import { Participants } from "../database/models/participants"

export async function getNewStatus(giveaway: Model<any, any>){
    if(giveaway.dataValues.type == "lotery"){
        const winnersCnt = await Participants.findAll({
            where:{
                giveawayId: giveaway.dataValues.id,
                status: ["paid", "awaitingPayment"]
            }
        })
        if (winnersCnt.length < giveaway.dataValues.receiverCount){
            return "awaitingPayment"
        } else {
            return "lost"
        }
    } else {
        return "awaitingEnd"
    }
}