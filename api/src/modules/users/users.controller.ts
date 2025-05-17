import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService
  ) {}

  @Get()
  @Roles('ADMIN')
  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      }
    });

    return users.map(user => ({
      ...user,
      isAdmin: user.role === 'ADMIN'
    }));
  }

  @Patch(':id/deactivate')
  @Roles('ADMIN')
  async deactivateUser(@Param('id') id: string) {
    return this.authService.updateUserStatus(id, 'INACTIVE');
  }

  @Patch(':id/activate')
  @Roles('ADMIN')
  async activateUser(@Param('id') id: string) {
    return this.authService.updateUserStatus(id, 'ACTIVE');
  }
} 