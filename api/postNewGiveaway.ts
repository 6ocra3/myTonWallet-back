import { Response, Request } from "express";
import { NewGiveawayBody, NewGiveawayResponse } from "../types/giveaway";
import { Giveaways } from "../database/models/giveaways";
import { v4 } from "uuid";
import { config } from "../config";

export async function postNewGiveaway( req: Request<{}, {}, NewGiveawayBody>, res: Response<NewGiveawayResponse>){
    try {
        const giveawayInfo = req.body.giveaway
        const d = v4()
        console.log(giveawayInfo.taskUrl, d)
        const newGiveaway = await Giveaways.create({
          type: giveawayInfo.type,
          endsAt: giveawayInfo.endsAt,
          tokenAddress: giveawayInfo.tokenAddress || null,
          amount: giveawayInfo.amount,
          receiverCount: giveawayInfo.receiverCount,
          taskUrl: giveawayInfo.taskUrl || null,
          taskToken: giveawayInfo.taskUrl ? v4() : null,
          status: "pending",
          participantCount: 0
        });

        console.log(newGiveaway.dataValues)
        
        const Response:NewGiveawayResponse = {
          giveawayLink: `https://my.tt/g/${newGiveaway.dataValues.id}`, 
          topUpLink: `ton://transfer/${config.MAIN_ADDRESS}?${giveawayInfo.tokenAddress ? "token="+giveawayInfo.tokenAddress+"&":""}amount=${giveawayInfo.amount * giveawayInfo.receiverCount}&comment=${newGiveaway.dataValues.id}`
        }

        if (giveawayInfo.taskUrl){
          console.log("HERE")
          Response["taskToken"] = newGiveaway.dataValues.taskToken
        }

        console.log(Response)

        res.json(Response);
      } catch (err: any) {
        res.status(500).send({ error: 'Ошибка при создании нового розыгрыша: ' + err.message });
      } 
}