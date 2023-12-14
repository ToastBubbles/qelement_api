
    import { SculptureColor } from '../models/sculptureColor.entity';

    export const sculptureColorsProviders = [
    {
        provide: 'SCULPTURECOLOR_REPOSITORY',
        useValue: SculptureColor,
    },
    ];
    