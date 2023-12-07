import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserPreference } from 'src/models/userPreference.entity';
import { UserPreferencesService } from '../services/userPreference.service';
import { IAPIResponse, IUserPrefDTO } from 'src/interfaces/general';

@Controller('userPreference')
export class UserPreferencesController {
  constructor(
    private readonly userPreferencesService: UserPreferencesService,
  ) {}

  @Get()
  async getAllUserPreferences(): Promise<UserPreference[]> {
    return this.userPreferencesService.findAll();
  }

  @Post('/userId/:userId')
  async editColor(
    @Param('userId') userId: number,
    @Body()
    d: IUserPrefDTO,
  ): Promise<IAPIResponse> {
    let hasChanged = false;
    let prefToChange = await this.userPreferencesService.findOneByUserId(
      userId,
    );
    if (prefToChange) {
      if (d.lang !== 'unchanged' && d.lang != prefToChange.lang) {
        prefToChange.lang = d.lang;
        hasChanged = true;
      }
      if (d.isCollectionVisible !== prefToChange.isCollectionVisible) {
        prefToChange.isCollectionVisible = d.isCollectionVisible;
        hasChanged = true;
      }
      if (d.isWantedVisible !== prefToChange.isWantedVisible) {
        prefToChange.isWantedVisible = d.isWantedVisible;
        hasChanged = true;
      }
      if (d.allowMessages !== prefToChange.allowMessages) {
        prefToChange.allowMessages = d.allowMessages;
        hasChanged = true;
      }
      if (d.prefName !== 'unchanged' && d.prefName != prefToChange.prefName) {
        prefToChange.prefName = d.prefName;
        hasChanged = true;
      }
      if (d.prefId !== 'unchanged' && d.prefId != prefToChange.prefId) {
        prefToChange.prefId = d.prefId;
        hasChanged = true;
      }
    } else {
      const newPref = await UserPreference.create({
        userId: userId,
        lang: d.lang != null ? d.lang : null,
        isCollectionVisible:
          d.isCollectionVisible != null ? d.isCollectionVisible : null,
        isWantedVisible: d.isWantedVisible != null ? d.isWantedVisible : null,
        allowMessages: d.allowMessages != null ? d.allowMessages : null,
        prefName: d.prefName != null ? d.prefName : null,
        prefId: d.prefId != null ? d.prefId : null,
      }).catch((e) => {
        return { code: 501, message: `generic error` };
      });
      if (newPref instanceof UserPreference)
        return { code: 200, message: `created!` };
      return { code: 502, message: `failed to create prefs` };
    }
    if (hasChanged) {
      prefToChange.save();
      return { message: `pref changes saved for ${userId}`, code: 200 };
    }

    return { message: `no changes were made`, code: 500 };
  }
}
