import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { UserPreference } from 'src/models/userPreference.entity';
import { UserPreferencesService } from '../services/userPreference.service';
import { IAPIResponse, IUserPrefDTO } from 'src/interfaces/general';
import { User } from 'src/models/user.entity';

@Controller('userPreference')
export class UserPreferencesController {
  constructor(
    private readonly userPreferencesService: UserPreferencesService,
  ) {}

  @Get()
  async getAllUserPreferences(): Promise<UserPreference[]> {
    return this.userPreferencesService.findAll();
  }

  @Post('/userId')
  async editPrefs(
    @Body() d: IUserPrefDTO,
    @Req() req: any,
  ): Promise<IAPIResponse> {
    let hasChanged = false;
    const userId = req.user.id;
    const user = await User.findByPk(userId);
    if (!user) return { code: 504, message: 'User not found' };
    let prefToChange = await this.userPreferencesService.findOneByUserId(
      userId,
    );
    if (prefToChange) {
      if (d.lang != prefToChange.lang) {
        prefToChange.lang = d.lang;
        hasChanged = true;
      }
      if (d.isCollectionVisible != prefToChange.isCollectionVisible) {
        prefToChange.isCollectionVisible = d.isCollectionVisible;
        hasChanged = true;
      }
      if (d.isWantedVisible != prefToChange.isWantedVisible) {
        prefToChange.isWantedVisible = d.isWantedVisible;
        hasChanged = true;
      }
      if (
        d.differentiateMaterialsInCollection !=
        prefToChange.differentiateMaterialsInCollection
      ) {
        prefToChange.differentiateMaterialsInCollection =
          d.differentiateMaterialsInCollection;
        hasChanged = true;
      }
      if (d.allowMessages != prefToChange.allowMessages) {
        // prefToChange.update({ allowMessages: d.allowMessages });
        prefToChange.allowMessages = d.allowMessages;

        hasChanged = true;
      }
      if (d.prefName != prefToChange.prefName) {
        prefToChange.prefName = d.prefName;
        hasChanged = true;
      }
      if (d.prefId != prefToChange.prefId) {
        prefToChange.prefId = d.prefId;
        hasChanged = true;
      }
    } else {
      const newPref = await UserPreference.create({
        userId: userId,
        lang: d.lang,
        isCollectionVisible: d.isCollectionVisible,
        isWantedVisible: d.isWantedVisible,
        differentiateMaterialsInCollection:
          d.differentiateMaterialsInCollection,
        allowMessages: d.allowMessages,
        prefName: d.prefName,
        prefId: d.prefId,
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
