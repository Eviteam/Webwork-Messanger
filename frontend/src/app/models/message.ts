import { User } from './user';

export class Message {
  _id?: string;
  receiver_id?: string;
  message?: string;
  sender?: [User] | number;
  sender_id?: number;
  team_id?: string | number;
  isSeen?: boolean;
  filePath?: Array<string | ArrayBuffer>;
  room?: string | number;
  createdAt?: string;
  updatedAt?: string
}

export class WebWorkMessage {
  team_id?: number | string;
  sender_id?: number | string;
  receiver_id?: number | string;
  message?: string;
  fullName?: string;
  messageCount?: number;
  attachment: string | null
}
