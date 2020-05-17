import { Injectable, NotFoundException } from '@nestjs/common';
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
    const idea: Idea = await this.ideaRepository.findOne(id);
    if (!idea) throw new NotFoundException();
    return idea;
  }

  async createIdea(data: IdeaModel): Promise<any> {
    const idea = this.ideaRepository.create(data);
    await this.ideaRepository.save(idea);
    return idea;
  }

  async deleteIdea(id: string): Promise<any> {
    const response: any = await this.ideaRepository.delete({ id });
    if (response.affected == 0) throw new NotFoundException();
    return { deleted: true };
  }

  async updateIdea(id: string, data: Partial<IdeaModel>): Promise<Idea> {
    const response = await this.ideaRepository.update({ id }, data);
    if (response.affected == 0) throw new NotFoundException();
    return this.ideaRepository.findOne(id);
  }
}