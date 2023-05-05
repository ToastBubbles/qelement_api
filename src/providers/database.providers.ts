import { Sequelize } from 'sequelize-typescript';
import { Category } from 'src/models/category.entity';
import { Color } from 'src/models/color.entity';
import { Subcategory } from 'src/models/subcategory.entity';
import { Part } from '../models/part.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: process.env.POSTGRES_HOST || 'localhost',
        port: Number(process.env.DATABASE_PORT) || 5432,
        username: process.env.POSTGRES_USERNAME || 'postgres',
        password: process.env.POSTGRES_PASSWORD || '',
        database: process.env.POSTGRES_NAME || 'postgres',
      });
      sequelize.addModels([Part, Category, Subcategory, Color]);

      await sequelize.sync();
      return sequelize;
    },
  },
];
