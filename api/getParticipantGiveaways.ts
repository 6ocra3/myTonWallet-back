import { Request, Response } from "express";
import { getParticipantAddressParams } from "../types/giveaway";
import { Giveaway } from "../types/giveaway";
import { Giveaways } from "../database/models/giveaways";
import { Participants } from "../database/models/participants";

export async function getParticipantGiveaways(req: Request<getParticipantAddressParams>, res: Response<Giveaway[]>) {
    const address = req.params.participant_address;

    const participantEntries = await Participants.findAll({
        attributes: ["giveawayId"],
        where: { receiverAddress: address }
    });

    const ids = participantEntries.map(entry => entry.dataValues.giveawayId);

    if (!ids.length) {
        return res.json([]);
    }

    const giveaways = await Giveaways.findAll({
        where: {
            id: ids
        }
    });

    const formattedGiveaways = giveaways.map(giveaway => giveaway.dataValues);

    res.json(formattedGiveaways);
}