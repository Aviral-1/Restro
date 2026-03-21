import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

class RegisterDto {
  @IsNotEmpty() @IsString() name: string;
  @IsEmail() email: string;
  @IsNotEmpty() @IsString() password: string;
  @IsNotEmpty() @IsString() role: string;
  @IsOptional() @IsString() phone?: string;
}

class LoginDto {
  @IsEmail() email: string;
  @IsNotEmpty() @IsString() password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.sub);
  }
}
