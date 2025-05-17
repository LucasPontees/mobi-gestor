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
    const usuarios = await this.prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        status: true,
        criadoEm: true,
      }
    });

    return usuarios.map(usuario => ({
      ...usuario,
      isAdmin: usuario.tipo === 'ADMIN'
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