import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
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
  getIdea(@Param('id') id: string) {
    return this.ideaService.findOneById(id);
  }

  @Post()
  createIdea(@Body() idea: IdeaModel) {
    return this.ideaService.createIdea(idea);
  }

  @Put(':id')
  updateIdea(@Param('id') id: string, @Body() idea: Partial<IdeaModel>) {
    return this.ideaService.updateIdea(id, idea);
  }

  @Delete(':id')
  deleteIdea(@Param('id') id: string) {
    return this.ideaService.deleteIdea(id);
  }
}
