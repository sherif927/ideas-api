import { IsString } from "class-validator";
import { UserModel } from "src/user/models/user.dto";
import { Idea } from "src/idea/idea.entity";

export class CommentModel {
  @IsString()
  text: string;
}

export class CommentResponse {
  id: string;
  text: string;
  createdAt: Date;
  author: UserModel;
  idea: Idea;
}