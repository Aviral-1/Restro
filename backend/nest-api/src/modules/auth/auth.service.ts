import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../../schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: { name: string; email: string; password: string; role: string; phone?: string }) {
    const existing = await this.userModel.findOne({ email: dto.email });
    if (existing) throw new ConflictException('Email already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 12);
    const user = await this.userModel.create({ ...dto, password: hashedPassword });

    const token = this.jwtService.sign({ sub: user._id, role: user.role });
    const { password, ...result } = user.toObject();
    return { accessToken: token, user: result };
  }

  async login(dto: { email: string; password: string }) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ sub: user._id, role: user.role });
    const { password, ...result } = user.toObject();
    return { accessToken: token, user: result };
  }

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }
}
