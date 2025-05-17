import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { BetsService } from './bets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateBetDto, UpdateBetResultDto, createBetSchema, updateBetResultSchema } from './dto/bet.dto';
import { User } from '../auth/decorators/user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

@Controller('bets')
@UseGuards(JwtAuthGuard)
export class BetsController {
  constructor(private readonly betsService: BetsService) {}

  @Post()
  async create(
    @User('id') userId: string,
    @Body(new ZodValidationPipe(createBetSchema)) dto: CreateBetDto
  ) {
    return this.betsService.create(userId, dto);
  }

  @Put(':id/result')
  async updateResult(
    @User('id') userId: string,
    @Param('id') betId: string,
    @Body(new ZodValidationPipe(updateBetResultSchema)) dto: UpdateBetResultDto
  ) {
    return this.betsService.updateResult(userId, betId, dto);
  }

  @Get()
  async getUserBets(@User('id') userId: string) {
    return this.betsService.getUserBets(userId);
  }

  @Get('stats')
  async getBetStats(@User('id') userId: string) {
    return this.betsService.getBetStats(userId);
  }
} 