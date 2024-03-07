import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import {
  IAPIResponse,
  IAPIResponseWithIds,
  IKnownRow,
  IMassKnown,
  IQPartEdits,
  IQPartVerifcation,
  ISearchOnly,
  iIdOnly,
  iQPartDTO,
} from 'src/interfaces/general';
import { QPart } from 'src/models/qPart.entity';
import { QPartsService } from '../services/qPart.service';
import { trimAndReturn, validateQPartType } from 'src/utils/utils';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UsersService } from 'src/services/user.service';
import { PartStatusesService } from 'src/services/partStatus.service';
import { User } from 'src/models/user.entity';
import { SubmissionCount } from 'src/models/submissionCount.entity';

@Controller('qpart')
export class QPartsController {
  constructor(
    private readonly qPartsService: QPartsService,
    private readonly userService: UsersService,
    private readonly partStatusesService: PartStatusesService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  @Get()
  async getAllQParts(): Promise<QPart[]> {
    return this.qPartsService.findAll();
  }
  @Get('/search')
  async getSearchResults(@Query() data: ISearchOnly): Promise<QPart[] | null> {
    return this.qPartsService.findPartsBySearch(data.search);
  }
  @Get('/recent/:limit')
  async getRecentQParts(@Param('limit') limit: number = 10): Promise<QPart[]> {
    return this.qPartsService.findRecent(limit);
  }

  @Get('/id/:id')
  async findById(@Param('id') id: number): Promise<QPart | null> {
    return this.qPartsService.findById(id);
  }

  @Get('/colorMatches/:colorId')
  async findMatchesByColorId(
    @Param('colorId') colorId: number,
  ): Promise<QPart[] | null> {
    return this.qPartsService.findMatchesByColorId(colorId);
  }

  @Get('/qpotd')
  async getQPartOfTheDay(): Promise<QPart | null> {
    try {
      let partOfTheDay = await this.cacheManager.get<QPart>('PartOfTheDay');
      if (partOfTheDay) {
        return partOfTheDay;
      }

      partOfTheDay = await this.qPartsService.getRandom();
      if (partOfTheDay) {
        this.cacheManager.set(
          'PartOfTheDay',
          partOfTheDay,
          1000 * 60 * 60 * 24,
        );
        return partOfTheDay as QPart;
      }
      return null;
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  @Get('/getDetails/:id')
  async findDetails(@Param('id') qpartId: number): Promise<QPart | null> {
    let match = await this.qPartsService.findById(qpartId);
    if (match) return match;
    return null;
  }

  @Get('/matchesByPartId/:id')
  async findMatches(@Param('id') partId: number): Promise<QPart[] | null> {
    return await this.qPartsService.findMatchesByPartId(partId);
  }

  @Get('/checkIfExists')
  async checkIfExists(@Query() data: IQPartVerifcation): Promise<IAPIResponse> {
    try {
      let qpart = await this.qPartsService.findIfExists(data);
      if (qpart) {
        return { code: 201, message: 'Already Exists!' };
      }
      return { code: 200, message: 'Good to go' };
    } catch (error) {
      return { code: 500, message: 'error' };
    }
  }

  @Get('/notApproved')
  async getAllNotApprovedCategories(): Promise<QPart[]> {
    return this.qPartsService.findAllNotApproved();
  }

  @Post('/approve')
  async approveQPart(
    @Body()
    data: iIdOnly,
  ): Promise<IAPIResponse> {
    try {
      let thisObj = await this.qPartsService.findByIdAll(data.id);
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
  async denyQPart(
    @Body()
    data: iIdOnly,
  ): Promise<IAPIResponse> {
    try {
      let thisObj = await this.qPartsService.findByIdAll(data.id);

      if (thisObj) {
  

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
    data: iQPartDTO,
  ): Promise<IAPIResponse> {
    try {
      let user = await this.userService.findOneById(data.creatorId);
      let isAdmin = false;
      if ((user && user?.role == 'admin') || user.role == 'trusted') {
        isAdmin = true;
      }
      const newQPart = await QPart.create({
        moldId: data.moldId,
        colorId: data.colorId,
        type: validateQPartType(data.type),
        creatorId: data.creatorId == -1 ? 1 : data.creatorId,
        isMoldUnknown: data.isMoldUnknown,
        note: trimAndReturn(data.note),
        approvalDate: isAdmin
          ? new Date().toISOString().slice(0, 23).replace('T', ' ')
          : null,
      });
      console.log(newQPart);

      if (newQPart instanceof QPart) {
        if (isAdmin) {
          return { code: 201, message: newQPart.id };
        }

        return { code: 200, message: newQPart.id };
      } else return { code: 500, message: `part aready exists` };
    } catch (error) {
      console.log(error);
      return { code: 500, message: `generic error` };
    }
  }

  @Post('/edit')
  async editPart(
    @Body()
    data: IQPartEdits,
    @Req() req: any,
  ): Promise<IAPIResponse> {
    try {
      const userId = req.user.id;
      const user = await User.findByPk(userId);
      if (!user) return { code: 504, message: 'User not found' };
      if (user.role !== 'trusted' && user.role !== 'admin')
        return { code: 403, message: 'User not authorized' };

      if (data.id > 0) {
        let thisPart = await this.qPartsService.findById(data.id);

        if (!thisPart) return { code: 404, message: 'Part not found' };

        let checkMold = data.moldId == -1 ? thisPart.moldId : data.moldId;
        let checkColor = data.colorId == -1 ? thisPart.colorId : data.colorId;
        let qpartVerification = await this.qPartsService.findIfExists({
          moldId: checkMold,
          colorId: checkColor,
        });
        if (qpartVerification) {
          return { code: 507, message: 'Already Exists!' };
        }
        if (data.type.trim() !== '') {
          thisPart.type = validateQPartType(data.type);
        }
        if (data.note !== '') {
          thisPart.note = trimAndReturn(data.note);
        }
        if (data.moldId !== -1) {
          thisPart.moldId = data.moldId;
        }
        if (data.colorId !== -1) {
          thisPart.colorId = data.colorId;
        }
        if (data.isMoldUnknown !== 0) {
          thisPart.isMoldUnknown = data.isMoldUnknown > 0 ? true : false;
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

  @Post('/mass')
  async massAddKnown(
    @Body()
    data: IMassKnown,
  ): Promise<IAPIResponseWithIds> {
    try {
      if (data.moldId == -1)
        return { code: 511, message: 'error, bad moldID', ids: null };
      let user = await this.userService.findOneById(data.userId);
      let isAdmin = false;
      let didMiss = false;
      if ((user && user?.role == 'admin') || user.role == 'trusted') {
        isAdmin = true;
      }

      const createdParts: QPart[] = [];
      const createdPartIds: number[] = [];

      for (const part of data.parts) {
        const newQPart = await this.createKnownPart(
          part,
          data.moldId,
          data.userId,
          isAdmin,
        );

        if (newQPart instanceof QPart) {
          createdParts.push(newQPart);
          createdPartIds.push(newQPart.id);
        } else {
          didMiss = true;
          return { code: 509, message: 'error', ids: createdPartIds };
        }
      }

      if (createdParts.length > 0) {
        if (isAdmin) {
          return {
            code: 201,
            message: 'added, and approved',
            ids: createdPartIds,
          };
        }
        return {
          code: 200,
          message: 'submitted for approval',
          ids: createdPartIds,
        };
      } else {
        return {
          code: 500,
          message: 'All parts already exist or generic error',
          ids: null,
        };
      }
    } catch (error) {
      console.error(error);
      return { code: 500, message: 'Generic error', ids: null };
    }
  }

  private async createKnownPart(
    part: IKnownRow,
    moldId: number,
    userId: number,
    isAdmin: boolean,
  ): Promise<QPart | null> {
    try {
      // Check if the part already exists or create a new one

      const existingPart = await this.qPartsService.findIfExists({
        colorId: part.colorId,
        moldId: moldId,
      });

      if (existingPart) {
        return null;
      }

      // Create a new QPart
      const newQPart = await QPart.create({
        moldId: moldId,
        colorId: part.colorId,
        creatorId: userId == -1 ? 1 : userId,
        approvalDate: isAdmin
          ? new Date().toISOString().slice(0, 23).replace('T', ' ')
          : null,
      });

      return newQPart;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
