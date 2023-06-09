import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export interface ISimilarColorDTO {
  color_one: number;
  color_two: number;
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
}

export interface iQPartDTO {
  partId: number;
  colorId: number;
  elementId: string;
  secondaryElementId: string;
  creatorId: number;
  note: string;
}
export interface IQPartDTO {
  id: number;
  partId: number;
  colorId: number;
  elementId: string;
  secondaryElementId: string;
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

export interface IAPIResponse {
  code: number;
  message: string;
}
export interface IPartDTO {
  name: string;
  number: string;
  secondaryNumber: string;
  CatId: number;
  note: string;
}
export interface IMessageDTO {
  recipientId: number;
  senderId: number;
  subject: string;
  body: string;
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

export interface IMailbox {
  inbox: IExtendedMessageDTO[];
  outbox: IExtendedMessageDTO[];
}
