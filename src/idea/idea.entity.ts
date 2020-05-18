import { AbstractEntity } from "src/shared/entities/AbstractEntity";
import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { type } from "os";
import { User } from "src/user/user.entity";
import { IdeaResponse } from "./models/idea.dto";

@Entity('idea')
export class Idea extends AbstractEntity {
  @Column() text: string;
  @Column() description: string;
  @ManyToOne(type => User, user => user.ideas) author: User;
  @ManyToMany(type => User, { cascade: true }) @JoinTable() upvotes: User[];
  @ManyToMany(type => User, { cascade: true }) @JoinTable() downvotes: User[];

  toResponseObject(): IdeaResponse {
    const { id, text, createdAt, description, author, downvotes, upvotes } = this;
    const response: any = { id, text, description, createdAt };
    response['upvotes'] = (upvotes) ? upvotes.length : 0;
    response['downvotes'] = (downvotes) ? downvotes.length : 0;
    if (author) response['author'] = author.toResponseObject();
    return response;
  }
}