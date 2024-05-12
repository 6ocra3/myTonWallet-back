import { getGiveawayParams, giveawayCheckinBody,giveawayCheckinResponse } from "../types/giveaway";
import { Response, Request } from "express";
import { Giveaways } from "../database/models/giveaways";
import { Participants } from "../database/models/participants";
import { getNewStatus } from "../utils/getNewStatus";

export async function postGiveawayCheckin(req: Request<getGiveawayParams, {}, giveawayCheckinBody>, res: Response<giveawayCheckinResponse>){
    //TODO: Проверка подписи
    if (true){
        try{
            const giveawayCheckinBody = req.body
            const id = req.params.giveaway_id

            const giveaway = await Giveaways.findByPk(id);

            if (!giveaway) {
                res.status(404).send({ error: 'Giveaway not found' });
                return;
            }

            await giveaway.update({participantCount: giveaway.dataValues.participantCount+1})

            let status;
            if (giveaway.dataValues.taskUrl){
                status = "awaitingTask"
            } else{
                status = await getNewStatus(giveaway)
            }
            
            await Participants.create({
                giveawayId: id,
                receiverAddress: giveawayCheckinBody.receiverAddress,
                status: status
            })

            res.json(giveaway.dataValues)

        } catch (err: any) {
            res.status(500).send({ error: 'Ошибка при чекине:' + err.message });
        }
    }
}