import { User } from "./user";

export interface Team {
  team?: TeamData,
  user_id?: string
}

export interface TeamData {
  team_id?: number;
  team_name?: string;
  user_id?: string;
  users?: [User]
}