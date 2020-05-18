import { AbstractEntity } from "src/shared/entities/AbstractEntity";
import { Entity, Column, BeforeInsert, OneToMany, JoinTable, ManyToMany } from "typeorm";
import * as Bcrypt from 'bcrypt';
import { UserModel } from "./models/user.dto";
import { Idea } from "src/idea/idea.entity";

@Entity('user')
export class User extends AbstractEntity {
  @Column({ type: 'text', unique: true }) username: string;
  @Column({ type: 'text' }) password: string;
  @OneToMany(type => Idea, idea => idea.author) ideas: Idea[];
  @ManyToMany(type => Idea, { cascade: true }) @JoinTable() bookmarks: Idea[];


  @BeforeInsert() async hashPassword() {
    this.password = await Bcrypt.hash(this.password, 10);
  }

  toResponseObject(): UserModel {
    const { id, username, createdAt, ideas, bookmarks } = this;
    const books = (bookmarks) ? bookmarks.map(bookmark => bookmark.toResponseObject()) : [];
    return { id, username, createdAt, ideas, bookmarks: books } as UserModel;
  }

  comparePasswords(attemptPassword: string) {
    return Bcrypt.compare(attemptPassword, this.password);
  }
}