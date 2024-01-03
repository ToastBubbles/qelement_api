import { Sequelize } from 'sequelize-typescript';
import { Category } from 'src/models/category.entity';
import { Color } from 'src/models/color.entity';
import { QPart } from 'src/models/qPart.entity';
import { User } from 'src/models/user.entity';
import { Part } from '../models/part.entity';
import { Image } from '../models/image.entity';
import { RaretyRating } from 'src/models/raretyRating.entity';
import { Message } from 'src/models/message.entity';
import { Comment } from 'src/models/comment.entity';
import { UserFavorite } from 'src/models/userFavorite.entity';
import { UserInventory } from 'src/models/userInventory.entity';
import { UserPreference } from 'src/models/userPreference.entity';
import { PartStatus } from 'src/models/partStatus.entity';
import { SimilarColor } from 'src/models/similarColor.entity';
import { Title } from 'src/models/title.entity';
import { UserTitle } from 'src/models/userTitle.entity';
import { PartMold } from 'src/models/partMold.entity';
import { UserGoal } from 'src/models/userGoal.entity';
import { ElementID } from 'src/models/elementID.entity';
import { SecurityQuestion } from 'src/models/securityQuestion.entity';
import { PredefinedSecurityQuestion } from 'src/models/predefinedSecurityQuestion.entity';
import { Sculpture } from 'src/models/sculpture.entity';
import { SculptureInventory } from 'src/models/sculptureInventory.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: process.env.POSTGRES_HOST || 'db',
        port: Number(process.env.DATABASE_PORT) || 5432,
        username: process.env.POSTGRES_USERNAME || 'postgres',
        password: process.env.POSTGRES_PASSWORD || '',
        database: process.env.POSTGRES_NAME || 'postgres',
        timezone: 'utc',
      });
      sequelize.addModels([
        Category,
        Part,
        PartMold,
        Color,
        QPart,
        PartStatus,
        User,
        Image,
        RaretyRating,
        Message,
        Comment,
        UserFavorite,
        UserInventory,
        UserPreference,
        SimilarColor,
        Title,
        UserTitle,
        UserGoal,
        ElementID,
        SecurityQuestion,
        PredefinedSecurityQuestion,
        Sculpture,
        SculptureInventory,
      ]);

      await sequelize.sync();
      return sequelize;
    },
  },
];
