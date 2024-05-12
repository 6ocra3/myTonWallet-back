import { Request, Response } from "express";
import { getGiveawayParams } from "../types/giveaway";
import { completeTaskBody, completeTaskResponse } from "../types/participant";
import { Participants } from "../database/models/participants";
import { Giveaways } from "../database/models/giveaways";
import { getNewStatus } from "../utils/getNewStatus";
export async function postCompleteTask(req: Request<getGiveawayParams, {}, completeTaskBody>, res: Response<completeTaskResponse>) {
    try{
        const giveawayId = req.params.giveaway_id
        const taskToken = req.body.taskToken

        const giveaway = await Giveaways.findByPk(giveawayId)
    
        if (!giveaway) {
            res.status(404).send({ error: 'Giveaway not found' });
            return;
        }

        if(giveaway.dataValues.taskToken != taskToken){
            res.status(400).send({ error: "Wronk task id"})
        }
    
        const participant = await Participants.findAll({
            where:{
                giveawayId: giveawayId,
                receiverAddress: req.body.receiverAddress
            }
        })
        const findedParticipant = participant[0]
        if(findedParticipant.dataValues.status == "awaitingTask"){
            await findedParticipant.update({status: (await getNewStatus(giveaway))})
        }
        res.status(200).send({ok: true})
    } catch (err: any) {
        res.status(400).send({ error: 'Ошибка при выполнении задачи:' + err.message });
    }

}