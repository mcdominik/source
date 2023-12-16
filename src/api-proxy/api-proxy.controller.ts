import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiProxyService } from './api-proxy.service';

@Controller('api-proxy')
export class ApiProxyController {
  constructor(private readonly apiProxyService: ApiProxyService) {}

  @Get('films/:id')
  getFilm(@Param('id') id: number) {
    return this.apiProxyService.getFilm(id);
  }

  @Get('films')
  getFilms(@Query('page') page: number, @Query('search') search: string) {
    return this.apiProxyService.getFilms(page, search);
  }

  @Get('films/crawls-with-unique-pairs')
  getUniquePairsWithCountFromFilmsOpeningCrawl() {
    return this.apiProxyService.getUniquePairsWithCountFromFilmsOpeningCrawl();
  }

  @Get('people/most-frequent-name-from-crawl')
  getMostFrequentNameFromFilmsOpeningCrawl() {
    return this.apiProxyService.getMostFrequentNameFromFilmsOpeningCrawl();
  }
}
