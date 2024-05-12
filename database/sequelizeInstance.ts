import { Sequelize } from "sequelize";

export const sequelizeInstance = new Sequelize('myappdb', 'myappuser', 'mypassword', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432, // стандартный порт PostgreSQL, укажите другой, если ваш сервер использует нестандартный порт
    dialectOptions: {
      // необязательные настройки, например, для работы с SSL:
      // ssl: {
      //   require: true,
      //   rejectUnauthorized: false
      // }
    }
  });