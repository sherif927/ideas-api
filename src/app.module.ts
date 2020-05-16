import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module';
import { IdeaModule } from './idea/idea.module';

@Module({
  imports: [TypeOrmModule.forRoot(), AuthModule, IdeaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
