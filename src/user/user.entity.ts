import { AbstractEntity } from "src/shared/entities/AbstractEntity";
import { Entity, Column, BeforeInsert } from "typeorm";
import * as Bcrypt from 'bcrypt';
import { UserModel } from "./models/user.dto";

@Entity('user')
export class User extends AbstractEntity {
  @Column({ type: 'text', unique: true }) username: string;
  @Column({ type: 'text' }) password: string;

  @BeforeInsert() async hashPassword() {
    this.password = await Bcrypt.hash(this.password, 10);
  }

  toResponseObject(): UserModel {
    const { id, username, createdAt } = this;
    return { id, username, createdAt } as UserModel;
  }

  comparePasswords(attemptPassword: string) {
    return Bcrypt.compare(attemptPassword, this.password);
  }
}