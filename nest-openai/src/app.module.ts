import { Module } from '@nestjs/common';
import { SmartThingModule } from './smart-thing/smart-thing.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), SmartThingModule],
})
export class AppModule {}
