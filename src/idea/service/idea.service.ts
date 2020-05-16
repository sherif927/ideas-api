import { Injectable } from '@nestjs/common';
import { Idea } from '../idea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdeaModel } from '../models/idea.dto';

@Injectable()
export class IdeaService {
  constructor(@InjectRepository(Idea) private ideaRepository: Repository<Idea>) { }

  async findAll(): Promise<Idea[]> {
    return await this.ideaRepository.find();
  }

  async findOneById(id: string): Promise<Idea | undefined> {
    return await this.ideaRepository.findOne(id);
  }

  async createIdea(data: IdeaModel): Promise<any> {
    const idea = this.ideaRepository.create(data);
    await this.ideaRepository.save(idea);
    return idea;
  }

  async deleteIdea(id: string): Promise<any> {
    await this.ideaRepository.delete({ id })
    return { deleted: true };
  }

  async updateIdea(id: string, data: Partial<IdeaModel>): Promise<Idea> {
    await this.ideaRepository.update({ id }, data);
    return this.ideaRepository.findOne(id);
  }
}
