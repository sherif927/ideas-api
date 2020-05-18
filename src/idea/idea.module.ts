import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeaController } from './idea.controller';
import { IdeaService } from './service/idea.service';
import { Idea } from './idea.entity';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Idea, User])],
  controllers: [IdeaController],
  providers: [IdeaService],
  exports: [TypeOrmModule]
})
export class IdeaModule { }
