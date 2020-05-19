import { AbstractEntity } from "src/shared/entities/AbstractEntity";
import { Entity, Column, ManyToMany, JoinTable, ManyToOne } from "typeorm";
import { Idea } from "src/idea/idea.entity";
import { User } from "src/user/user.entity";
import { CommentResponse } from "./models/comment.dto";

@Entity('comment')
export class Comment extends AbstractEntity {
  @Column() text: string;
  @ManyToOne(type => User) @JoinTable() author: User;
  @ManyToOne(type => Idea, idea => idea.comments) idea: Idea;

  toResponseObject() {
    const { id, text, createdAt, author, idea } = this;
    return { id, text, createdAt, idea, author: author.toResponseObject() } as CommentResponse;
  }
}