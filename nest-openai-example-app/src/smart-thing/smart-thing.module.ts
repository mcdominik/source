import { Module } from '@nestjs/common';
import { SmartThingController } from './smart-thing.controller';
import { SmartThingService } from './smart-thing.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Module({
  imports: [ConfigModule],
  controllers: [SmartThingController],
  providers: [
    SmartThingService,
    {
      provide: OpenAI,
      useFactory: (configService: ConfigService) => {
        const apiKey = configService.get<string>('OPENAI_API_KEY');
        return new OpenAI({ apiKey });
      },
      inject: [ConfigService],
    },
  ],
  exports: [SmartThingService],
})
export class SmartThingModule {}
