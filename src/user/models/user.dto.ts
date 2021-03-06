import { IsString, MinLength, Matches } from "class-validator";
import { Idea } from "src/idea/idea.entity";
import { IdeaModel } from "src/idea/models/idea.dto";

export class LoginModel {
  @IsString()
  username: string;

  @IsString()
  password: string;
}


export class RegistrationModel {
  @IsString()
  username: string;

  @MinLength(8)
  @Matches(new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})"))
  password: string;

}

export class UserModel {
  id: string;
  username: string;
  createdAt: Date;
  ideas: IdeaModel[];
  token?: string;
}