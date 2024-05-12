import { Giveaways } from "../database/models/giveaways";
import { getGiveawayParams, getGiveawayResponse, Giveaway } from "../types/giveaway";
import { Response, Request } from "express";

export async function getGiveaway(req: Request<getGiveawayParams>, res: Response<getGiveawayResponse>) {
    const id = req.params.giveaway_id
    const giveaway = await Giveaways.findByPk(id); // Использование метода findByPk для поиска Giveaway

    if (!giveaway) {
        res.status(404).send({ error: 'Giveaway not found' }); // Если Giveaway не найден, отправляем ошибку 404
        return;
    }

    res.json(giveaway.dataValues);
}