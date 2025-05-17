import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { nome: dto.username },
    });

    if (!usuario) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, usuario.senha);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (usuario.status === 'INACTIVE') {
      throw new UnauthorizedException('INACTIVE_USER');
    }

    return {
      access_token: await this.jwtService.signAsync({
        sub: usuario.id,
        username: usuario.nome,
        role: usuario.tipo,
      }),
      user: {
        id: usuario.id,
        username: usuario.nome,
        email: usuario.email,
        role: usuario.tipo,
        status: usuario.status,
      },
    };
  }

  async register(dto: RegisterDto) {
    const usuarioExistente = await this.prisma.usuario.findFirst({
      where: {
        OR: [
          { nome: dto.username },
          { email: dto.email },
        ],
      },
    });

    if (usuarioExistente) {
      throw new UnauthorizedException('Username or email already exists');
    }

    const senhaHash = await bcrypt.hash(dto.password, 10);

    const usuario = await this.prisma.usuario.create({
      data: {
        nome: dto.username,
        email: dto.email,
        senha: senhaHash,
        status: 'ACTIVE',
        banca: {
          create: {
            valorInicial: 0,
            valorAtual: 0,
          },
        },
      },
    });

    return {
      access_token: await this.jwtService.signAsync({
        sub: usuario.id,
        username: usuario.nome,
        role: usuario.tipo,
      }),
      user: {
        id: usuario.id,
        username: usuario.nome,
        email: usuario.email,
        role: usuario.tipo,
        status: usuario.status,
      },
    };
  }

  async updateUserStatus(userId: string, status: 'ACTIVE' | 'INACTIVE') {
    return this.prisma.usuario.update({
      where: { id: userId },
      data: { status },
    });
  }
}