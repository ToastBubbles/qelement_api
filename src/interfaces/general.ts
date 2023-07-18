import { SetMetadata } from '@nestjs/common';
import { Color } from 'src/models/color.entity';
import { Part } from 'src/models/part.entity';
import { RaretyRating } from 'src/models/raretyRating.entity';
import { User } from 'src/models/user.entity';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export interface ISimilarColorDTO {
  color_one: number;
  color_two: number;
}

export interface IMailbox {
  inbox: IExtendedMessageDTO[];
  outbox: IExtendedMessageDTO[];
}

export interface IColorDTO {
  bl_name: string;
  tlg_name: string;
  bo_name: string;
  hex: string;
  bl_id: number;
  tlg_id: number;
  bo_id: number;
  type: string;
  note: string;
  isOfficial: boolean;
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

export interface iQPartDTO {
  moldId: number;
  colorId: number;
  elementId: string;
  type: string;
  creatorId: number;
  note: string;
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
  name: string;
  email: string;
  password: string;
  role: string;
}
export interface ILoginDTO {
  username: string;
  password: string;
}
export interface iNameOnly {
  name: string;
}
export interface IQPartDetails {
  part: IPartDTO;
  color: IColorDTO;
  qpart: iQPartDTO;
}

export interface iIdOnly {
  id: number;
}
export interface iIdAndPrimary {
  id: number;
  isPrimary: boolean;
}

export interface IAPIResponse {
  code: number;
  message: string;
}
export interface IPartDTO {
  name: string;
  CatId: number;
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
  CatId: number;
  partNote: string;
  moldNote: string;
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
  qpartId: number;
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
