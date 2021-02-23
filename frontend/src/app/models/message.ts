import { User } from "./user";

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