import { Types } from "mongoose";
import { TUser } from "../repositories/models";

export interface IGoogleUserInfo {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
}

export type TTokenPayload = (TUser & { id: Types.ObjectId }) | null;
