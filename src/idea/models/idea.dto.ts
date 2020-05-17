import { IsString } from 'class-validator';

export class IdeaModel {

  @IsString()
  text: string;

  @IsString()
  description: string;
}