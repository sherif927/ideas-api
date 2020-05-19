import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import { IdeaModule } from './idea/idea.module';
import { UserModule } from './user/user.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [TypeOrmModule.forRoot(), IdeaModule, UserModule, CommentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
