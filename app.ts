import express, {Response, Request} from 'express';
import { postNewGiveaway } from './api/postNewGiveaway';
import { NewGiveawayBody, NewGiveawayResponse, getParticipantAddressParams, giveawayCheckinBody, giveawayCheckinResponse } from './types/giveaway';
import { sequelizeInstance } from './database/sequelizeInstance';
import { Giveaway, getGiveawayParams, getGiveawayResponse } from './types/giveaway';
import { getGiveaway } from './api/getGiveaway';
import { postGiveawayCheckin } from './api/postGiveawayCheckin';
import { completeTaskBody, completeTaskResponse } from './types/participant';
import { postCompleteTask } from './api/postCompleteTask';
const app = express();
import cron from "node-cron"
import { checkFinishedGiveaways } from './regulars/findEnds';
import { getWalletTransactions } from './regulars/checkWalletBalance';
import { getParticipantGiveaways } from './api/getParticipantGiveaways';
import cors from 'cors';
import { payToWinners } from './regulars/sendTokens';
const PORT = 3000;

app.use(express.json());

app.use(cors({
    origin: 'https://mysubdomain.loca.lt'
}));

app.get('/', (req, res) => {
    res.json({answer: 'Привет, мир!'});
});

app.post("/giveaways", (req: Request<{}, {}, NewGiveawayBody>, res: Response<NewGiveawayResponse>) => postNewGiveaway(req, res));

app.get("/giveaways/:giveaway_id", (req: Request<getGiveawayParams>, res: Response<getGiveawayResponse>) => getGiveaway(req, res))

app.post("/giveaways/:giveaway_id/checkin", (req: Request<getGiveawayParams, {}, giveawayCheckinBody>, res: Response<giveawayCheckinResponse>) => {postGiveawayCheckin(req, res)})

app.post("/giveaways/:giveaway_id/complete-task", (req: Request<getGiveawayParams, {}, completeTaskBody>, res: Response<completeTaskResponse>) => {postCompleteTask(req, res)})

app.get("/participants/:participant_address", (req: Request<getParticipantAddressParams>, res: Response<Giveaway[]>) => getParticipantGiveaways(req, res))

app.listen(PORT, () => {
    sequelizeInstance.sync({ force: false })
        .then(() => console.log("Таблицы были успешно синхронизированы"))
        .catch((err) => console.error("Ошибка при синхронизации таблиц: ", err));
    console.log(`Сервер запущен на порту ${PORT}`);
});

cron.schedule('*/5 * * * * *', () => {
    console.log('Running a task every 5 seconds');
    checkFinishedGiveaways();
    getWalletTransactions()
    payToWinners()
});