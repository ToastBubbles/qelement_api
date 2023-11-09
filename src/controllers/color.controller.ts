import { Body, Controller, Get, Post } from '@nestjs/common';
import { Param } from '@nestjs/common/decorators';
import { IQelementError } from 'src/interfaces/error';
import {
  IAPIResponse,
  IColorDTO,
  Public,
  iIdOnly,
} from 'src/interfaces/general';
import { Color } from 'src/models/color.entity';
import { ColorsService } from '../services/color.service';
import { trimAndReturn } from 'src/utils/utils';
import { UsersService } from 'src/services/user.service';

@Controller('color')
export class ColorsController {
  constructor(
    private readonly colorsService: ColorsService,
    private readonly userService: UsersService,
  ) {}

  @Public()
  @Get()
  async getAllColors(): Promise<Color[]> {
    return this.colorsService.findAll();
  }

  @Public()
  @Get('/id/:id')
  async findOne(@Param('id') id: number): Promise<Color | IQelementError> {
    return this.colorsService.findById(id);
  }

  @Get('/notApproved')
  async getAllNotApprovedCategories(): Promise<Color[]> {
    return this.colorsService.findAllNotApproved();
  }

  @Post('/approve')
  async approveColor(
    @Body()
    data: iIdOnly,
  ): Promise<IAPIResponse> {
    try {
      let thisObj = await this.colorsService.findByIdAll(data.id);
      if (thisObj) {
        thisObj.update({
          approvalDate: new Date().toISOString().slice(0, 23).replace('T', ' '),
        });
        return { code: 200, message: `approved` };
      } else return { code: 500, message: `not found` };
    } catch (error) {
      console.log(error);
      return { code: 500, message: `generic error` };
    }
  }

  @Post()
  async addNewColor(
    @Body()
    {
      bl_name,
      tlg_name,
      bo_name,
      hex,
      bl_id,
      tlg_id,
      bo_id,
      type,
      note,
      isOfficial,
      creatorId,
    }: IColorDTO,
  ): Promise<string> {
    try {
      let user = await this.userService.findOneById(creatorId);
      let isAdmin = false;
      if (user && user?.role == 'admin' || user.role == 'trusted') {
        isAdmin = true;
      }
      let newColor = Color.create({
        bl_name: trimAndReturn(bl_name, 100),
        tlg_name: trimAndReturn(tlg_name, 100),
        bo_name: trimAndReturn(bo_name, 100),
        hex: trimAndReturn(hex, 6),
        bl_id: bl_id == -1 ? null : bl_id,
        tlg_id: tlg_id == -1 ? null : tlg_id,
        bo_id: bo_id == -1 ? null : bo_id,
        type: trimAndReturn(type),
        note: trimAndReturn(note),
        isOfficial: isOfficial,
        approvalDate: isAdmin
          ? new Date().toISOString().slice(0, 23).replace('T', ' ')
          : null,
      }).catch((e) => {
        return { code: 500, message: `generic error` };
      });

      if (newColor instanceof Color) return `new color added`;
      else return 'error';
    } catch (error) {
      console.log(error);

      return 'error';
    }
  }

  @Post('/id/:id')
  async editColor(
    @Param('id') id: number,
    @Body()
    {
      bl_name,
      tlg_name,
      bo_name,
      hex,
      bl_id,
      bo_id,
      tlg_id,
      type,
      note,
      isOfficial,
    }: IColorDTO,
  ): Promise<IAPIResponse> {
    let hasChanged = false;
    let colorToChange = (await this.colorsService.findById(id)) as Color;
    if (colorToChange) {
      if (bl_name !== 'unchanged' && bl_name != colorToChange.bl_name) {
        colorToChange.bl_name = trimAndReturn(bl_name);
        hasChanged = true;
      }
      if (tlg_name !== 'unchanged' && tlg_name != colorToChange.tlg_name) {
        colorToChange.tlg_name = trimAndReturn(tlg_name);
        hasChanged = true;
      }
      if (bo_name !== 'unchanged' && bo_name != colorToChange.bo_name) {
        colorToChange.bo_name = trimAndReturn(bo_name);
        hasChanged = true;
      }
      if (hex !== 'unchanged' && hex.length == 6 && hex != colorToChange.hex) {
        colorToChange.hex = hex;
        hasChanged = true;
      }
      if (note !== 'unchanged' && note != colorToChange.note) {
        colorToChange.note = trimAndReturn(note);
        hasChanged = true;
      }
      if (type !== 'unchanged' && type != colorToChange.type) {
        colorToChange.type = trimAndReturn(type);
        hasChanged = true;
      }
      if (bl_id !== -1 && bl_id != colorToChange.bl_id) {
        colorToChange.bl_id = bl_id;
        hasChanged = true;
      }
      if (bo_id !== -1 && bo_id != colorToChange.bo_id) {
        colorToChange.bo_id = bo_id;
        hasChanged = true;
      }
      if (tlg_id !== -1 && tlg_id != colorToChange.tlg_id) {
        colorToChange.tlg_id = tlg_id;
        hasChanged = true;
      }
      if (isOfficial != isOfficial) {
        colorToChange.isOfficial = isOfficial;
        hasChanged = true;
      }
    }
    if (hasChanged) {
      colorToChange.save();
      return { message: `color changes saved for ${id}`, code: 200 };
    }

    return { message: `no changes were made`, code: 500 };
  }
}
