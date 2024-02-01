import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiProxyService } from './api-proxy.service';

@Controller('api-proxy')
export class ApiProxyController {
  constructor(private readonly apiProxyService: ApiProxyService) {}

  @Get('films/:id')
  getFilmById(@Param('id') id: number) {
    return this.apiProxyService.getFilmById(id);
  }

  @Get('films')
  getFilms(@Query('page') page: number, @Query('search') search: string) {
    return this.apiProxyService.getFilms(page, search);
  }

  @Get('species/:id')
  getSpeciesById(@Param('id') id: number) {
    return this.apiProxyService.getSpeciesById(id);
  }

  @Get('species')
  getSpecies(@Query('page') page: number, @Query('search') search: string) {
    return this.apiProxyService.getSpecies(page, search);
  }

  @Get('vehicles/:id')
  getVehicleById(@Param('id') id: number) {
    return this.apiProxyService.getVehicleById(id);
  }

  @Get('vehicles')
  getVehicles(@Query('page') page: number, @Query('search') search: string) {
    return this.apiProxyService.getVehicles(page, search);
  }

  @Get('starships/:id')
  getStarshipById(@Param('id') id: number) {
    return this.apiProxyService.getStarshipById(id);
  }

  @Get('starships')
  getStarships(@Query('page') page: number, @Query('search') search: string) {
    return this.apiProxyService.getStarships(page, search);
  }

  @Get('planets/:id')
  getPlanetById(@Param('id') id: number) {
    return this.apiProxyService.getPlanetById(id);
  }

  @Get('planets')
  getPlanets(@Query('page') page: number, @Query('search') search: string) {
    return this.apiProxyService.getPlanets(page, search);
  }
}
