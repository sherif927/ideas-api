import { IsString } from 'class-validator';
import { UserModel } from 'src/user/models/user.dto';

export class IdeaModel {

  @IsString()
  text: string;

  @IsString()
  description: string;
}

export class IdeaResponse {
  id: string;
  text: string;
  description: string;
  createdAt: Date;
  author: UserModel;
  upvotes: number;
  downvotes: number;
}