import { Module } from '@nestjs/common';
import { ApiProxyService } from './api-proxy.service';
import { ApiProxyController } from './api-proxy.controller';

@Module({
  controllers: [ApiProxyController],
  providers: [ApiProxyService],
})
export class ApiProxyModule {}
