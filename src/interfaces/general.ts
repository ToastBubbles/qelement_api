import { SetMetadata } from '@nestjs/common';
import { Color } from 'src/models/color.entity';
import { Part } from 'src/models/part.entity';
import { RaretyRating } from 'src/models/raretyRating.entity';
import { User } from 'src/models/user.entity';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const purpleColor = '\x1b[35m';
export const greenColor = '\x1b[32m'; // Green color
export const resetColor = '\x1b[0m'; // Reset color

export interface ISimilarColorDTO {
  color_one: number;
  color_two: number;
  creatorId: number;
}

export interface IMailbox {
  inbox: IExtendedMessageDTO[];
  outbox: IExtendedMessageDTO[];
}
export interface IUserPrefDTO {
  lang: string;
  isCollectionVisible: boolean;
  isWantedVisible: boolean;
  allowMessages: boolean;
  prefName: string;
  prefId: string;
}
export interface IChangeUserRole {
  userId: number;
  newRole: string;
  adminId: number;
}
export interface IColorDTO {
  bl_name: string;
  tlg_name: string;
  bo_name: string;
  hex: string;
  swatchId: number;
  bl_id: number;
  tlg_id: number;
  bo_id: number;
  type: string;
  note: string;
  isOfficial: boolean;
  creatorId: number;
}
export interface INotApporvedCounts {
  colors: number;
  categories: number;
  parts: number;
  partMolds: number;
  qelements: number;
  partStatuses: number;
  similarColors: number;
  images: number;
  sculptures: number;
  sculptureInventories: number;
  elementIDs: number;
}

export interface ISculptureWithArrayOfIdsDTO {
  sculptureId: number;
  qpartIds: number[];
}

export interface IArrayOfSculptureInvIds {
  data: ISculptureWithArrayOfIdsDTO[];
}
export interface ISimColorIdWithInversionId {
  id: number;
  inversionId: number;
}
export interface IQPartDTOInclude {
  id: number;
  type: string;
  mold: IPartMoldDTO;
  color: Color;
  creator: User;
  note: string;
  elementId: string;
  rating: RaretyRating;
}

export interface IPartStatusDTO {
  status: string;
  date: string;
  location: string;
  note: string;
  qpartId: number;
  creatorId: number;
}
export interface IKnownRow {
  colorId: number;
  elementId: string;
}
export interface IMassKnown {
  userId: number;
  moldId: number;
  parts: IKnownRow[];
}
export interface iQPartDTO {
  moldId: number;
  colorId: number;
  elementId: string;
  isMoldUnknown: boolean;
  type: string;
  creatorId: number;
  note: string;
}
export interface IDeletionDTO {
  itemToDeleteId: number;
  userId: number;
}

export interface ICreateScupltureDTO {
  name: string;
  brickSystem: string;
  location: string;
  note: string;
  yearMade: number;
  yearRetired: number;
  keywords: string;
  creatorId: number;
}
export interface IQPartDTO {
  id: number;
  moldId: number;
  colorId: number;
  elementId: string;
  type: string;

  creatorId: number;
  note: string;
  rarety: number;
  // createdAt: string;
  // updatedAt: string;
}
export interface IRatingDTO {
  // id: number;
  rating: number;
  qpartId: number;
  creatorId: number;
}
export interface IUserDTO {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}
export interface ISuspendUser {
  type: string;
  untilDate: string;
  reason: string;
  userId: number;
  adminId: number;
}
export interface IUserRecover {
  newPassword: string;
  email: string;
  q1Id: number;
  q2Id: number;
  a1: string;
  a2: string;
}
export interface IUserWSecQDTO {
  name: string;
  email: string;
  password: string;
  role: string;
  favoriteColorId?: number;
  q1: ISecurityQuestionDTO;
  q2: ISecurityQuestionDTO;
  q3: ISecurityQuestionDTO;
}
export interface ISecurityQuestionDTO {
  questionId: number;
  answer: string;
}
export interface ILoginDTO {
  username: string;
  password: string;
}
export interface iNameOnly {
  name: string;
}

export interface ICatDTO {
  name: string;
  creatorId: number;
}

export interface IQPartDetails {
  part: IPartDTO;
  color: IColorDTO;
  qpart: iQPartDTO;
}

export interface IUserTitle {
  userId: number;
  titleId: number;
}
export interface ITitle {
  title: string;
  cssClasses: string;
}

export interface ITitleDTO extends ITitle {
  id: number;
}
export interface ITitlesToAddToUsers {
  user: IUserDTO;
  title: ITitleDTO;
}

export interface IUserTitlePackedDTO {
  array: ITitlesToAddToUsers[];
}

export interface iIdOnly {
  id: number;
}

export interface IIdAndNumber extends iIdOnly {
  number: number;
}
export interface IIdAndString extends iIdOnly {
  string: string;
}
export interface iIdAndPrimary extends iIdOnly {
  isPrimary: boolean;
}
export interface IArrayOfIDs {
  userId: number;
  ids: number[];
}

export interface IAPIResponseWithIds {
  code: number;
  message: string;
  ids: number[] | null;
}
export interface IAPIResponse {
  code: number;
  message: string;
}
export interface IPartDTO {
  name: string;
  catId: number;
  note: string;
}

export interface IPartEdits {
  id: number;
  name: string;
  catId: number;
  blURL: string;
}
export interface IMoldEdits {
  id: number;
  number: string;
  parentPartId: number;
  note: string;
}

export interface IQPartEdits {
  id: number;
  type: string;
  moldId: number;
  colorId: number;
  isMoldUnknown: number; //three state boolean -1 = false, 1 = true, 0 = unchanged
  note: string;
}

export interface IPartMoldDTO {
  id: number;
  number: string;
  parentPartId: number;
  creatorId: number;
  note: string;
  approvalDate: string;
  createdAt: string;
}

export interface IPartWithMoldDTO {
  id: number;
  name: string;
  number: string;
  catId: number;
  partNote: string;
  moldNote: string;
  blURL: string;
  creatorId: number;
}
export interface IMessageDTO {
  recipientId: number;
  senderId: number;
  subject: string;
  body: string;
}
export interface ICommentCreationDTO {
  userId: number;
  content: string;
  qpartId?: number;
  sculptureId?: number;
}
export interface ImageSubmission {
  qpartId: number;
  userId: number;
  type: string;
}
export interface MinioConfig {
  endPoint: string;
  port: number;
  useSSL: boolean;
  accessKey: string;
  secretKey: string;
}
export interface IExtendedMessageDTO {
  id: number;
  recipientId: number;
  senderId: number;
  recipientName: string;
  senderName: string;
  subject: string;
  body: string;
  read: boolean;
  createdAt: string;
}
export interface IQPartVerifcation {
  moldId: number;
  colorId: number;
}

export interface ISculpturePartIdPair {
  sculptureId: number;
  qpartId: number;
}
export interface IElementIDCreationDTO {
  number: number;
  creatorId: number;
  qpartId: number;
}
export interface ICatEditDTO {
  id: number;
  newName: string;
  creatorId: number;
}
export interface ISearchOnly {
  search: string;
}
export interface ICollectionDTO {
  forTrade: boolean;
  forSale: boolean;
  availDupes: boolean;
  qpartId: number;
  userId: number;
  quantity: number;
  condition: string;
  note: string;
}
export interface IWantedDTO {
  type: string;
  qpartId: number;
  userId: number;
}
export interface IGoalDTO {
  userId: number;
  partId: number;
  moldId: number;
  name: string;
  solid: boolean;
  trans: boolean;
  other: boolean;
  known: boolean;
}
