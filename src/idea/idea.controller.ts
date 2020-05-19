import { Controller, Get, Post, Put, Delete, Param, Body, ParseUUIDPipe, UsePipes, ValidationPipe, UseGuards, Query } from '@nestjs/common';
import { IdeaService } from './service/idea.service';
import { IdeaModel } from './models/idea.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthUser } from 'src/auth/auth.user.dec';
import { userInfo } from 'os';

@Controller('idea')
export class IdeaController {

  constructor(private ideaService: IdeaService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll(@Query('page') page: number) {
    return this.ideaService.findAll(page);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/newest')
  getNewest(@Query('page') page: number) {
    return this.ideaService.findAll(page, true);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getIdea(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.ideaService.findOneById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new ValidationPipe())
  createIdea(@AuthUser() userInfo, @Body() idea: IdeaModel) {
    return this.ideaService.createIdea(idea, userInfo.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UsePipes(new ValidationPipe())
  updateIdea(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @AuthUser() userInfo, @Body() idea: Partial<IdeaModel>) {
    return this.ideaService.updateIdea(id, userInfo.id, idea);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteIdea(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @AuthUser() userInfo) {
    return this.ideaService.deleteIdea(id, userInfo.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/bookmark')
  bookmarkIdea(@AuthUser() userInfo, @Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.ideaService.bookmarkIdea(id, userInfo.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/bookmark')
  unbookmarkIdea(@AuthUser() userInfo, @Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.ideaService.unbookmarkIdea(id, userInfo.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/upvote')
  upvoteIdea(@AuthUser() userInfo, @Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.ideaService.upvoteIdea(id, userInfo.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/downvote')
  downvoteIdea(@AuthUser() userInfo, @Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.ideaService.downvoteIdea(id, userInfo.id);
  }

}
