import { Controller, Get, Param, Post, Body, Query, Req } from '@nestjs/common';
import {
  IAPIResponse,
  IAPIResponseWithIds,
  IPartEdits,
  IPartWithMoldDTO,
  ISearchOnly,
  iIdOnly,
} from 'src/interfaces/general';
import { Part } from 'src/models/part.entity';
import { PartsService } from '../services/parts.service';
import { trimAndReturn } from 'src/utils/utils';
import { PartMoldsService } from 'src/services/partMold.service';
import { PartMold } from 'src/models/partMold.entity';
import { UsersService } from 'src/services/user.service';
import { User } from 'src/models/user.entity';

@Controller('parts')
export class PartsController {
  constructor(
    private readonly partsService: PartsService,
    private readonly userService: UsersService, // private readonly partsMoldService: PartMoldsService,
    private readonly partMoldsService: PartMoldsService,
  ) {}

  @Get()
  async getAllParts(): Promise<Part[]> {
    return this.partsService.findAll();
  }

  @Get('/byCatId/:id')
  async getPartsByCatId(@Param('id') id: number): Promise<Part[] | null> {
    return this.partsService.findPartsByCatId(id);
  }

  @Get('/search')
  async getSearchResults(@Query() data: ISearchOnly): Promise<Part[] | null> {
    return this.partsService.findPartsBySearch(data.search);
  }

  @Get('/byNumber/:num')
  async getPartByNum(@Param('num') num: string): Promise<Part | undefined> {
    let result = await this.partsService.findPartByNum(num);

    if (result != null) return result;

    return undefined;
  }

  @Get('/id/:id')
  async findById(@Param('id') id: number): Promise<Part | null> {
    return this.partsService.findById(id);
  }

  // @Get('/qparts/:id')
  // async findByIDWithQParts(@Param('id') id: number): Promise<Part | null> {
  //   return this.partsService.findByIDWithQParts(id);
  // }

  @Get('/childrenById/:id')
  async findChildrenById(@Param('id') id: number): Promise<Part | null> {
    return this.partsService.findChildrenById(id);
  }

  @Get('/notApproved')
  async getAllNotApprovedCategories(): Promise<Part[]> {
    return this.partsService.findAllNotApproved();
  }

  @Post('/approve')
  async approvePart(
    @Body()
    data: iIdOnly,
  ): Promise<IAPIResponse> {
    try {
      let thisObj = await this.partsService.findByIdAll(data.id);

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
  @Post('/deny')
  async denyPart(
    @Body()
    data: iIdOnly,
  ): Promise<IAPIResponse | IAPIResponseWithIds> {
    try {
      let thisObj = await this.partsService.findByIdAll(data.id);

      const molds = await PartMold.findByParentPartID(data.id);
      if (molds.length > 0) {
        let ids: number[] = molds.map((mold) => mold.id);
        return {
          code: 400,
          message: `Molds are associated with this Part. Delete or modify the associated Molds first.`,
          ids,
        };
      }

      if (thisObj) {
        let children = await this.partMoldsService.findPartMoldsByParentID(
          data.id,
        );
        if (children && children.length > 0) {
          let canDelete = true;
          children.forEach((child) => {
            if (child.approvalDate != null) {
              canDelete = false;
            }
          });
          if (!canDelete)
            return {
              code: 509,
              message: `cannot delete children, requires indepth review`,
            };
          await Promise.all(children.map((child) => child.destroy()));
        }

        await thisObj.destroy();
        return { code: 200, message: `deleted` };
      } else return { code: 500, message: `not found` };
    } catch (error) {
      console.log(error);
      return { code: 500, message: `generic error` };
    }
  }

  @Post('/add')
  async addNewPart(
    @Body()
    data: IPartWithMoldDTO,
  ): Promise<IAPIResponse> {
    try {
      let user = await this.userService.findOneById(data.creatorId);
      let isAdmin = false;
      if ((user && user?.role == 'admin') || user.role == 'trusted') {
        isAdmin = true;
      }
      let id: number;
      if (data.id == -1) {
        let newPart = Part.create({
          name: trimAndReturn(data.name, 100),
          catId: data.catId,
          note: trimAndReturn(data.partNote),
          blURL: trimAndReturn(data.blURL, 20),
          creatorId: data.creatorId,
          approvalDate: isAdmin
            ? new Date().toISOString().slice(0, 23).replace('T', ' ')
            : null,
        }).catch((e) => {
          return { code: 500, message: `generic error` };
        });
        id = ((await newPart) as Part).dataValues.id;
      } else {
        id = data.id;
      }
      let newMold = PartMold.create({
        number: trimAndReturn(data.number),
        note: trimAndReturn(data.moldNote),
        parentPartId: id,
        approvalDate: isAdmin
          ? new Date().toISOString().slice(0, 23).replace('T', ' ')
          : null,
        creatorId: data.creatorId,
      }).catch((e) => {
        return { code: 500, message: `generic error` };
      });

      if (newMold instanceof PartMold)
        return { code: 200, message: `new part added` };
      else return { code: 500, message: `part not added` };
    } catch (error) {
      console.log(error);
      return { code: 500, message: `generic error` };
    }
  }

  @Post('/edit')
  async editPart(
    @Body()
    data: IPartEdits,
    @Req() req: any,
  ): Promise<IAPIResponse> {
    try {
      const userId = req.user.id;
      const user = await User.findByPk(userId);
      if (!user) return { code: 504, message: 'User not found' };
      if (user.role !== 'trusted' && user.role !== 'admin')
        return { code: 403, message: 'User not authorized' };

      if (data.id > 0) {
        let thisPart = await this.partsService.findById(data.id);

        if (!thisPart) return { code: 404, message: 'Part not found' };

        if (data.blURL !== '') {
          thisPart.blURL = data.blURL;
        }
        if (data.name !== '') {
          thisPart.name = data.name;
        }
        if (data.catId !== -1) {
          thisPart.catId = data.catId;
        }

        await thisPart.save();

        return { code: 200, message: 'Changes saved!' };
      }

      return { code: 500, message: `Part not added` };
    } catch (error) {
      console.log(error);
      return { code: 500, message: `Generic error` };
    }
  }
}
