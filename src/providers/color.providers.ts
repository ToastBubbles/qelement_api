
    import { Color } from '../models/color.entity';

    export const colorsProviders = [
    {
        provide: 'COLOR_REPOSITORY',
        useValue: Color,
    },
    ];
    