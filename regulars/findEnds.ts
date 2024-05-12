import { Op } from "sequelize";
import { Giveaways } from "../database/models/giveaways";
import { Participants } from "../database/models/participants";
import { Model } from "sequelize"
export function checkFinishedGiveaways() {
  try{
    const now = new Date();
    Giveaways.findAll({
      where: {
        endsAt: {
          [Op.lt]: now
        },
        status: {
          [Op.ne]: 'finished'
        }
      }
    }).then(giveaways => {
      giveaways.forEach(giveaway => {
        markWinnersAndLosers(giveaway)
        giveaway.update({ status: 'finished' });
        console.log(`Giveaway with ID: ${giveaway.dataValues.id} has been marked as ended.`);
      });
    }).catch(error => {
      console.error('Error updating giveaways:', error);
    });
  } catch(error){
    console.error(error)
  }

  }

async function markWinnersAndLosers(giveaway: Model<any, any>){
  try{
    const participants = await Participants.findAll({
      where: {
        giveawayId: giveaway.dataValues.id,
        status: "awaitingEnd"
      }
    })
  
    for (let i = participants.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [participants[i], participants[j]] = [participants[j], participants[i]];
    }
  
    for(let i = 0; i<participants.length;i++){
      if(i < giveaway.dataValues.receiverCount){
        participants[i].update({status: "awaitingPayment"})
      } else {
        participants[i].update({status: "lost"})
      }
    }
  
    const lazy = await Participants.findAll({
      where: {
        giveawayId: giveaway.dataValues.id,
        status: "awaitingTask"
      }
    })
  
    lazy.forEach(person => {
      person.update({status: "lost"})
    })
  } catch(error){
    console.error(error)
  }


}