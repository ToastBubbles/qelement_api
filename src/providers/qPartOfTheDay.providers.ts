import { QPartOfTheDayService } from 'src/services/qPartOfTheDay.service';


export const qPartOfTheDayProviders = [
  {
    provide: 'QPARTOFTHEDAY',
    useValue: QPartOfTheDayService,
  },
];
