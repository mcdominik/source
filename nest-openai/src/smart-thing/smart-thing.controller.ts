import { Controller, Get } from '@nestjs/common';
import { SmartThingService } from './smart-thing.service';

@Controller('smart-thing')
export class SmartThingController {
  constructor(private readonly smartThingService: SmartThingService) {}

  @Get()
  async getAllPricesFromText() {
    const message = 'Today I bought coffe for 6$ and cake for 7$';
    const response = this.smartThingService.getAllPricesFromText(message);
    return response;
  }
}
