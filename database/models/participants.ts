import { sequelizeInstance } from "../sequelizeInstance";
import { DataTypes } from "sequelize";
export const Participants = sequelizeInstance.define("Participants", {
    giveawayId:{
        type: DataTypes.BIGINT,
        allowNull: false
    },
    receiverAddress:{
        type: DataTypes.STRING,
        allowNull: false
    },
    status:{
        type: DataTypes.STRING,
        allowNull: false
    }}, {
        tableName: "participants"
    }
)