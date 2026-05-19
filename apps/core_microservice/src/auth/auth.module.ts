import { Module, Global } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenBlacklistService } from './token-blacklist.service';
import { TokenValidationService } from './token-validation.service';

@Global()
@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenBlacklistService, TokenValidationService],
  exports: [AuthService],
})
export class AuthModule {}
