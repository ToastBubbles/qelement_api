
    import { Image } from '../models/image.entity';

    export const imagesProviders = [
    {
        provide: 'IMAGE_REPOSITORY',
        useValue: Image,
    },
    ];
    