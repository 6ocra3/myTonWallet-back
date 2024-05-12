import { ErrorResponse, SuccesResponse } from "./general";

export interface Participant{
    giveawayId: string;
    receiverAddress: string;
    status: 'awaitingTask' | 'awaitingPayment' | 'awaitingEnd' | 'paid' | 'lost';
}

export interface completeTaskBody{
    taskToken: string;
    receiverAddress: string;
}

export type completeTaskResponse = SuccesResponse | ErrorResponse
