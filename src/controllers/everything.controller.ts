import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/interfaces/general';

import { Color } from 'src/models/color.entity';
import { colors } from '../utils/colorData';

@Controller('Everything')
export class EverythingController {
  constructor() {}

  @Public()
  @Get()
  boss(): string {
    colors.forEach((color) => {
      try {

        Color.create({
          bl_name: color.BLName,
          tlg_name: color.LName,
          bo_name: color.OName,
          hex: color.color || '000000',
          bl_id: Number(color.id) || 0,
          tlg_id: Number(color.Lid) || 0,
          type: color.type,
          note: color.note || '',
        });
      } catch (e) {
        //   let result = (e as Error).message;
        console.log(e);
      }
    });

    return 'Kay boss';
  }
}
