export interface Giveaway {
    type: 'instant' | 'lottery';
    endsAt?: Date;
    tokenAddress?: string;
    amount: number;
    receiverCount: number;
    taskUrl?: string;
    status: 'pending' | 'active' | 'finished';
    participantCount: number;
}

export interface NewGiveaway {
    type: 'instant' | 'lottery';
    endsAt?: Date;
    tokenAddress?: string;
    amount: number;
    receiverCount: number;
    taskUrl?: string;
}


  
export interface NewGiveawayBody {
    giveaway: NewGiveaway;
    secret: string;
}

type SuccessResponse = {
    giveawayLink: string; 
    topUpLink: string;
    taskToken?: string;
}

export interface getGiveawayParams{
    giveaway_id: number
}

export interface getParticipantAddressParams{
    participant_address: string
}

type ErrorResponse = {
    error: string;
}

export interface giveawayCheckinBody{
    captchaToken: string;
    receiverAddress: string;
    publicKey: string;
    signedProof: string;
}

export type NewGiveawayResponse = SuccessResponse | ErrorResponse
export type getGiveawayResponse = Giveaway | ErrorResponse
export type giveawayCheckinResponse = Giveaway | ErrorResponse