import { AbstractEntity } from "src/shared/entities/AbstractEntity";
import { Entity, Column } from "typeorm";

@Entity('idea')
export class Idea extends AbstractEntity {
  @Column() text: string;
  @Column() description: string;
}