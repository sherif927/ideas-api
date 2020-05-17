import { Controller, Get, Post, Put, Delete, Param, Body, ParseUUIDPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { IdeaService } from './service/idea.service';
import { IdeaModel } from './models/idea.dto';

@Controller('idea')
export class IdeaController {

  constructor(private ideaService: IdeaService) { }

  @Get()
  getAll() {
    return this.ideaService.findAll();
  }

  @Get(':id')
  getIdea(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.ideaService.findOneById(id);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  createIdea(@Body() idea: IdeaModel) {
    return this.ideaService.createIdea(idea);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  updateIdea(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Body() idea: Partial<IdeaModel>) {
    return this.ideaService.updateIdea(id, idea);
  }

  @Delete(':id')
  deleteIdea(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.ideaService.deleteIdea(id);
  }
}
