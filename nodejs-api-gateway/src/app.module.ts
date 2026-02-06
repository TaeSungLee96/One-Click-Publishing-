import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { HealthController } from './health.controller';

@Module({
  imports: [UserModule],
  controllers: [HealthController],
})
export class AppModule {}
