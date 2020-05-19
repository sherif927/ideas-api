import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CommentModel, CommentResponse } from '../models/comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Idea } from 'src/idea/idea.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Comment } from '../comment.entity';

@Injectable()
export class CommentService {

  constructor(
    @InjectRepository(Idea) private ideaRepository: Repository<Idea>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Comment) private commentRepository: Repository<Comment>) { }

  async show(id: string): Promise<CommentResponse> {
    const comment = await this.commentRepository.findOne({ where: { id }, relations: ['author', 'idea'] });
    if (!comment) throw new NotFoundException();
    return comment.toResponseObject();
  }

  async create(id: string, userId: string, data: CommentModel): Promise<CommentResponse> {
    const idea = await this.ideaRepository.findOne({ where: { id } });
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const comment = this.commentRepository.create({ ...data, idea, author: user });
    await this.commentRepository.save(comment);
    return comment.toResponseObject();
  }

  async destroy(id: string, userId: string): Promise<CommentResponse> {
    const comment = await this.commentRepository.findOne({ where: { id }, relations: ['author'] });
    if (comment.author.id !== userId) throw new UnauthorizedException();
    await this.commentRepository.remove(comment);
    return comment.toResponseObject();
  }

  async showByIdea(id: string): Promise<CommentResponse[]> {
    const idea = await this.ideaRepository.findOne({ where: { id }, relations: ['comments', 'comments.author', 'comments.idea'] });
    return idea.comments.map(c => c.toResponseObject());
  }


  async showByUser(userId: string): Promise<CommentResponse[]> {
    const comments = await this.commentRepository.find({ where: { author: { id: userId } }, relations: ['author'] });
    return comments.map(c => c.toResponseObject());
  }
}
