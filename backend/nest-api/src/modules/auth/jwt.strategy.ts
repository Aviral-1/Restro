import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'dev-secret-key-change-in-production-abc123',
    });
  }

  async validate(payload: any) {
    // Demo bypass for easy testing - allow any payload with a demo indicator or just any valid sub
    if (payload.isDemo) {
       return { sub: payload.sub || 'demo-user-id', role: 'restaurant_owner' };
    }
    
    if (!payload.sub) throw new UnauthorizedException();
    return { sub: payload.sub, role: payload.role };
  }
}
