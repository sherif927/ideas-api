import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './services/comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Idea } from 'src/idea/idea.entity';
import { User } from 'src/user/user.entity';
import { Comment } from './comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Idea, User, Comment])],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [TypeOrmModule]
})
export class CommentModule { }
