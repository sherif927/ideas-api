import { Controller, Get, Post, Put, Delete, Param, Body, ParseUUIDPipe, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { IdeaService } from './service/idea.service';
import { IdeaModel } from './models/idea.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('idea')
export class IdeaController {

  constructor(private ideaService: IdeaService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll() {
    return this.ideaService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getIdea(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.ideaService.findOneById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new ValidationPipe())
  createIdea(@Body() idea: IdeaModel) {
    return this.ideaService.createIdea(idea);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UsePipes(new ValidationPipe())
  updateIdea(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Body() idea: Partial<IdeaModel>) {
    return this.ideaService.updateIdea(id, idea);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteIdea(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.ideaService.deleteIdea(id);
  }
}
