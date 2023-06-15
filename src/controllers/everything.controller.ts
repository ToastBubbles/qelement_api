import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/interfaces/general';

import { Color } from 'src/models/color.entity';
import { colors } from '../utils/colorData';
import { SimilarColor } from 'src/models/similarColor.entity';

@Controller('addAllColors')
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
          bl_id: Number(color.id) || null,
          tlg_id: Number(color.Lid) || null,
          bo_id: Number(color.Oid) || null,
          type: color.type,
          note: color.note || '',
          approvalDate: new Date().toISOString().slice(0, 23).replace('T', ' '),
        });
      } catch (e) {
        //   let result = (e as Error).message;
        console.log(e);
      }
    });

    return 'Kay boss';
  }
}
