import { Body, Controller, Get, Post } from '@nestjs/common';
import { Param } from '@nestjs/common/decorators';
import { IQelementError } from 'src/interfaces/error';
import { IColorDTO, Public } from 'src/interfaces/general';
import { Color } from 'src/models/color.entity';
import { ColorsService } from '../services/color.service';

@Controller('color')
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  @Public()
  @Get()
  async getAllColors(): Promise<Color[]> {
    return this.colorsService.findAll();
  }

  @Public()
  @Get('/:id')
  async findOne(@Param('id') id: number): Promise<Color | IQelementError> {
    return this.colorsService.findById(id);
  }

  @Post()
  async addNewColor(
    @Body()
    { bl_name, tlg_name, bo_name, hex, bl_id, tlg_id, type, note }: IColorDTO,
  ): Promise<string> {
    let newColor = new Color({
      bl_name,
      tlg_name,
      bo_name,
      hex,
      bl_id,
      tlg_id,
      type,
      note,
    });
    newColor.save();

    return `new color added`;
  }

  @Post('/:id')
  async addSimilar(
    @Param('id') id: number,
    @Body()
    { bl_name, tlg_name, bo_name, hex, bl_id, tlg_id, type, note }: IColorDTO,
  ): Promise<string> {


    let hasChanged = false;
    let colorToChange = (await this.colorsService.findById(id)) as Color;
    if (colorToChange) {
      if (bl_name !== 'unchanged' && bl_name != colorToChange.bl_name) {
        colorToChange.bl_name = bl_name;
        hasChanged = true;
      }
      if (tlg_name !== 'unchanged' && tlg_name != colorToChange.tlg_name) {
        colorToChange.tlg_name = tlg_name;
        hasChanged = true;
      }
      if (bo_name !== 'unchanged' && bo_name != colorToChange.bo_name) {
        colorToChange.bo_name = bo_name;
        hasChanged = true;
      }
      if (hex !== 'unchanged' && hex.length == 6 && hex != colorToChange.hex) {
        colorToChange.hex = hex;
        hasChanged = true;
      }
      if (note !== 'unchanged' && note != colorToChange.note) {
        colorToChange.note = note;
        hasChanged = true;
      }
      if (bl_id !== -1 && bl_id != colorToChange.bl_id) {
        colorToChange.bl_id = bl_id;
        hasChanged = true;
      }
      if (tlg_id !== -1 && tlg_id != colorToChange.tlg_id) {
        colorToChange.tlg_id = tlg_id;
        hasChanged = true;
      }
    }
    if (hasChanged) {
      colorToChange.save();
      return `color changes saved for ${id}`;
    }

    return `not changes were made`;
  }
}
