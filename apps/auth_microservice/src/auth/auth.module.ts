import { Module, OnModuleInit } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { PasswordResetEventService } from '../services/password-reset-event.service';
import { RedisAuthRepository } from '../repositories/redis-auth.repository';
import { initPassport } from '../config/passport.init';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    PasswordResetEventService,
    RedisAuthRepository,
  ],
})
export class AuthModule implements OnModuleInit {
  constructor(private readonly authService: AuthService) {}

  onModuleInit() {
    initPassport(this.authService);
  }
}
