import { DynamicModule, Module } from '@nestjs/common';
import { ApiProxyModule } from './api-proxy/api-proxy.module';
import { ConfigModule } from '@nestjs/config';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import * as redisStore from 'cache-manager-redis-store';

@Module({})
export class AppModule {
  static forRoot(options: { db: number }): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ApiProxyModule,
        ConfigModule.forRoot(),
        CacheModule.register({
          store: redisStore,
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
          isGlobal: true,
          db: options.db,
        }),
      ],
      controllers: [],
      providers: [
        {
          provide: APP_INTERCEPTOR,
          useClass: CacheInterceptor,
        },
      ],
    };
  }
}
