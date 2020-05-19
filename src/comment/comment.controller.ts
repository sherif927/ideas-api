import { Controller, Param, Get, Post, Delete, UseGuards, Body, UsePipes, ValidationPipe, ParseUUIDPipe } from '@nestjs/common';
import { CommentService } from './services/comment.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthUser } from 'src/auth/auth.user.dec';
import { CommentModel } from './models/comment.dto';

@Controller('comment')
export class CommentController {

  constructor(private commentService: CommentService) { }

  @Get('idea/:id')
  showCommentsByIdea(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.commentService.showByIdea(id);
  }

  @Post('idea/:id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  createComment(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @AuthUser() user, @Body() data: CommentModel) {
    return this.commentService.create(id, user.id, data);
  }

  @Get('user/:id')
  showCommentsByUser(@Param('id', new ParseUUIDPipe({ version: '4' })) userId: string) {
    return this.commentService.showByUser(userId);
  }

  @Get(':id')
  showComment(@Param('id') id: string) {
    return this.commentService.show(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  destroyComment(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @AuthUser() user) {
    return this.commentService.destroy(id, user.id);
  }

}
