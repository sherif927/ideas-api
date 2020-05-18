import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Idea } from '../idea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdeaModel, IdeaResponse } from '../models/idea.dto';
import { User } from 'src/user/user.entity';
import { UserModel } from 'src/user/models/user.dto';
import { Votes } from '../../shared/utils/votes';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(Idea) private ideaRepository: Repository<Idea>,
    @InjectRepository(User) private userRepository: Repository<User>) { }

  async findAll(): Promise<IdeaResponse[]> {
    const ideas = await this.ideaRepository.find({ relations: ['author', 'upvotes', 'downvotes'] });
    if (!ideas) return [];
    return ideas.map(idea => idea.toResponseObject());
  }

  async findOneById(id: string): Promise<Idea | undefined> {
    const idea: Idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author', 'upvotes', 'downvotes'] });
    if (!idea) throw new NotFoundException();
    return idea;
  }

  async createIdea(data: IdeaModel, userId: string): Promise<IdeaResponse> {
    const user = await this.userRepository.findOne(userId);
    const idea = this.ideaRepository.create({ ...data, author: user });
    await this.ideaRepository.save(idea);
    return idea.toResponseObject();
  }

  async deleteIdea(id: string, userId: string): Promise<any> {
    const idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author'] });
    if (!idea) throw new NotFoundException();
    if (userId !== idea.author.id) throw new UnauthorizedException();
    const response: any = await this.ideaRepository.delete({ id });
    return { deleted: true };
  }

  async updateIdea(id: string, userId: string, data: Partial<IdeaModel>): Promise<Idea> {
    const idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author'] });
    if (!idea) throw new NotFoundException();
    if (userId !== idea.author.id) throw new UnauthorizedException();
    const response = await this.ideaRepository.update({ id }, data);
    return this.ideaRepository.findOne(id);
  }

  async bookmarkIdea(id: string, userId: string): Promise<UserModel> {
    const user: User = await this.userRepository.findOne({ where: { id: userId }, relations: ['bookmarks'] });
    const idea: Idea = await this.findOneById(id);
    if (user.bookmarks.filter(i => i.id === id).length >= 1) throw new BadRequestException();
    user.bookmarks.push(idea);
    await this.userRepository.save(user);
    return user.toResponseObject();
  }

  async unbookmarkIdea(id: string, userId: string): Promise<UserModel> {
    const user: User = await this.userRepository.findOne({ where: { id: userId }, relations: ['bookmarks'] });
    user.bookmarks = user.bookmarks.filter(i => i.id !== id);
    this.userRepository.save(user);
    return user.toResponseObject();
  }

  /**
   * handles the voting by checking if the 
   * user has voted before, if true it undoes
   * that vote , if not submits the new vote.
   *
   */
  private async handleVote(idea: Idea, user: User, vote: Votes): Promise<Idea> {
    const opposite = (vote == Votes.UP) ? Votes.DOWN : Votes.UP;
    if ( //if the user has already voted
      idea[opposite].filter(voter => voter.id === user.id).length > 0 ||
      idea[vote].filter(voter => voter.id === user.id).length > 0) {
      idea[opposite] = idea[opposite].filter(voter => voter.id !== user.id);
      idea[vote] = idea[vote].filter(voter => voter.id !== user.id);
      await this.ideaRepository.save(idea);
    }
    else if (idea[vote].filter(voter => voter.id === user.id).length < 1) { //if the user hasn't voted yet
      idea[vote].push(user);
      await this.ideaRepository.save(idea);
    }
    else throw new BadRequestException();
    return idea;
  }

  async upvoteIdea(id: string, userId: string): Promise<IdeaResponse> {
    const idea: Idea = await this.ideaRepository.findOne({ where: { id }, relations: ['upvotes', 'downvotes'] });
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const response = await this.handleVote(idea, user, Votes.UP);
    return response.toResponseObject();
  }

  async downvoteIdea(id: string, userId: string): Promise<IdeaResponse> {
    const idea: Idea = await this.ideaRepository.findOne({ where: { id }, relations: ['upvotes', 'downvotes'] });
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const response = await this.handleVote(idea, user, Votes.DOWN);
    return response.toResponseObject();
  }
}
