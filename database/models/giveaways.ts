import { DataTypes, Model } from "sequelize";
import { sequelizeInstance } from "../sequelizeInstance";
import { Giveaway } from "../../types/giveaway";

export const Giveaways = sequelizeInstance.define('Giveaways', {
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    endsAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    tokenAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    receiverCount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    taskUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    taskToken:{
      type: DataTypes.UUID,
      allowNull: true
    },
    status:{
        type: DataTypes.STRING,
        allowNull: false
    },
    participantCount:{
        type: DataTypes.INTEGER,
        allowNull: false
    }
  }, {
    tableName: 'giveaways'
  });