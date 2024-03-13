
import { MarbledPartColor } from 'src/models/marbledPartColor.entity';

export const marbledPartColorsProviders = [
{
provide: 'MARBLEDPARTCOLOR_REPOSITORY',
useValue: MarbledPartColor,
},
];
