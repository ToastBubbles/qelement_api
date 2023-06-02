import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { IAPIResponse, IPartDTO } from 'src/interfaces/general';
import { Category } from 'src/models/category.entity';
import { Part } from 'src/models/part.entity';
import { PartsService } from '../services/parts.service';

@Controller('parts')
export class PartsController {
  constructor(private readonly partsService: PartsService) {}

  @Get()
  async getAllParts(): Promise<Part[]> {
    return this.partsService.findAll();
  }

  @Get('/:id')
  async findById(@Param('id') id: number): Promise<Part | null> {
    return this.partsService.findById(id);
  }
  // @Get('/add')
  // async addTestPart(): Promise<Part> {
  //   let newPart = new Part({
  //     name: 'Brick, 2 x 4',
  //     number: '3001',
  //     CatId: 2,
  //   });
  //   newPart.save();
  //   return newPart;
  // }
  @Post()
  async addNewPart(
    @Body()
    data: IPartDTO,
  ): Promise<IAPIResponse> {
    let didSave = false;
    try {

      let newPart = new Part({
        name: data.name,
        number: data.number,
        CatId: data.CatId,
      });
      await newPart
        .save()
        .then(() => (didSave = true))
        .catch((err) => {});
      if (didSave) return { code: 200, message: `new part added` };
      else return { code: 500, message: `part aready exists` };
    } catch (error) {
      console.log(error);
      return { code: 500, message: `generic error` };
    }
  }
}
