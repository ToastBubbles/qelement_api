import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { IAPIResponse, IMarbledPartDTO } from 'src/interfaces/general';
import { MarbledPart } from 'src/models/marbledPart.entity';
import { MarbledPartColor } from 'src/models/marbledPartColor.entity';
import { User } from 'src/models/user.entity';
import { MarbledPartsService } from 'src/services/marbledPart.service';
import { trimAndReturn, validatePercentages } from 'src/utils/utils';

@Controller('marbledPart')
export class MarbledPartsController {
  constructor(private readonly marbledPartsService: MarbledPartsService) {}

  @Get('/all')
  async getAllMarbledParts(): Promise<MarbledPart[]> {
    return this.marbledPartsService.findAll();
  }

  @Post('/add')
  async addNewMarbledPart(
    @Body()
    data: IMarbledPartDTO,
    @Req() req: any,
  ): Promise<IAPIResponse> {
    try {
      let isAdmin = false;
      const userId = req.user.id;
      const user = await User.findByPk(userId);
      if (!user) return { code: 504, message: 'User not found' };
      if (user.role == 'trusted' || user.role == 'admin') {
        isAdmin = true;
      }
      if (data.colors.length <= 1)
        return { code: 501, message: 'Not enough colors' };
      if (data.colors.length > 10)
        return { code: 502, message: 'Too many colors!' };
      if (!validatePercentages(data.colors))
        return { code: 503, message: 'Invalid percentages' };

      const newMarbledPart = await MarbledPart.create({
        moldId: data.moldId,
        creatorId: userId,
        isMoldUnknown: data.isMoldUnknown,
        note: trimAndReturn(data.note),
        approvalDate: isAdmin
          ? new Date().toISOString().slice(0, 23).replace('T', ' ')
          : null,
      });

      if (newMarbledPart instanceof MarbledPart) {
        await Promise.all(
          data.colors.map(async (colObj) => {
            try {
              await MarbledPartColor.create({
                colorId: colObj.id,
                percent: colObj.number == -1 ? null : colObj.number,
                marbledPartId: newMarbledPart.id,
              });
            } catch (error) {
              console.error(`Error adding marble colors`);
            }
          }),
        );

        if (isAdmin) {
          return { code: 201, message: 'added' };
        }

        return { code: 200, message: 'Requested' };
      }
      return { code: 500, message: `error` };
    } catch (error) {
      console.log(error);
      return { code: 500, message: `generic error` };
    }
  }
}
