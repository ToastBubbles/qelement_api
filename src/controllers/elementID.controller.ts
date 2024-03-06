import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { ElementID } from 'src/models/elementID.entity';
import { ElementIDsService } from '../services/elementID.service';
import {
  IAPIResponse,
  IElementIDCreationDTO,
  IIdAndNumber,
  ISearchOnly,
  iIdOnly,
} from 'src/interfaces/general';
import { UsersService } from 'src/services/user.service';
import { User } from 'src/models/user.entity';
import { SubmissionCount } from 'src/models/submissionCount.entity';

@Controller('elementID')
export class ElementIDsController {
  constructor(
    private readonly elementIDsService: ElementIDsService,
    private readonly userService: UsersService,
  ) {}

  @Get()
  async getAllElementIDs(): Promise<ElementID[]> {
    return this.elementIDsService.findAll();
  }

  @Get('/notApproved')
  async getAllNotApprovedEIDs(): Promise<ElementID[]> {
    return this.elementIDsService.findAllNotApproved();
  }

  @Post('/approve')
  async approveEID(
    @Body()
    data: iIdOnly,
  ): Promise<IAPIResponse> {
    try {
      let thisObj = await this.elementIDsService.findByIdAll(data.id);
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
  async denyEID(
    @Body()
    data: iIdOnly,
  ): Promise<IAPIResponse> {
    try {
      let thisObj = await this.elementIDsService.findByIdAll(data.id);
      if (thisObj) {
        if(thisObj.approvalDate == null){
          await SubmissionCount.decreasePending(thisObj.creatorId)
        }else{
          await SubmissionCount.decreaseApproved(thisObj.creatorId)
        }
        await thisObj.destroy({ force: true });
        return { code: 200, message: `deleted` };
      } else return { code: 500, message: `not found` };
    } catch (error) {
      console.log(error);
      return { code: 500, message: `generic error` };
    }
  }

  @Get('/search')
  async getSearchResults(
    @Query() data: ISearchOnly,
  ): Promise<ElementID[] | null> {
    try {
      return this.elementIDsService.findPartsBySearch(data.search);
    } catch (error) {
      return null;
    }
  }

  @Post('/add')
  async addElementID(
    @Body()
    elementID: IElementIDCreationDTO,
  ): Promise<IAPIResponse> {
    try {
      let user = await this.userService.findOneById(elementID.creatorId);
      let isAdmin = false;
      if ((user && user?.role == 'admin') || user.role == 'trusted') {
        isAdmin = true;
      }
      let softDeletedEID = await this.elementIDsService.findSoftDeletedByNumber(
        elementID.number,
      );
      if (softDeletedEID && softDeletedEID.isSoftDeleted()) {
        softDeletedEID.restore();
        softDeletedEID.update({
          approvalDate: isAdmin
            ? new Date().toISOString().slice(0, 23).replace('T', ' ')
            : null,
          qpartId: elementID.qpartId,
          creatorId: elementID.creatorId,
        });
        softDeletedEID.save();
        if (isAdmin) return { code: 206, message: `Element ID restored` };
        return {
          code: 205,
          message: `Element ID restored with null approval date`,
        };
      }
      let newElementID = await ElementID.create({
        number: elementID.number,
        creatorId: elementID.creatorId,
        qpartId: elementID.qpartId,
        approvalDate: isAdmin
          ? new Date().toISOString().slice(0, 23).replace('T', ' ')
          : null,
      }).catch((e) => {
        return { code: 502, message: `generic error` };
      });
      console.log(newElementID);
      console.log(newElementID instanceof ElementID);

      if (newElementID instanceof ElementID) {
        if (isAdmin) return { code: 201, message: 'approved' };
        else return { code: 200, message: 'submitted' };
      }
      return { code: 501, message: 'failed' };
    } catch (error) {
      console.log(error);
      return { code: 500, message: error };
    }
  }

  @Post('/edit')
  async editElementID(
    @Body()
    data: IIdAndNumber,
    @Req() req: any,
  ): Promise<IAPIResponse> {
    try {
      const userId = req.user.id;
      const user = await User.findByPk(userId);
      if (!user) return { code: 504, message: 'User not found' };
      if (user.role !== 'admin')
        return { code: 506, message: 'User is not admin' };

      let existingEIDwithNewNumber =
        await this.elementIDsService.findSoftDeletedByNumber(data.number);
      if (existingEIDwithNewNumber) {
        if (existingEIDwithNewNumber.isSoftDeleted()) {
          await existingEIDwithNewNumber.destroy({ force: true });
        } else {
          return {
            code: 505,
            message: `Element ID conflicts with another ID`,
          };
        }
      }
      let thisEID = await this.elementIDsService.findByIdAll(data.id);
      if (thisEID) {
        await thisEID.update({
          number: data.number,
        });

        await thisEID.save();

        return { code: 200, message: 'Updated' };
      }
      return { code: 501, message: 'Failed to find by Id' };
    } catch (error) {
      console.log(error);
      return { code: 500, message: error };
    }
  }
}
