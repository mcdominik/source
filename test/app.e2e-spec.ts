import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';

import { Cache } from 'cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { INestApplication } from '@nestjs/common';
import { ApiProxyService } from '../src/api-proxy/api-proxy.service';
require('dotenv').config();

describe('cache', () => {
  let app: INestApplication;
  let cacheManager: Cache;
  let apiProxyService: ApiProxyService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule.forRoot({ db: 1 })],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    cacheManager = app.get(CACHE_MANAGER);
    apiProxyService = app.get(ApiProxyService);
    await cacheManager.reset();
  });

  it('should cache response', async () => {
    const endpoint = '/api-proxy/films/1';

    const cachedItemBeforeCall = await cacheManager.get(endpoint);
    const responseFirstCall = await request(app.getHttpServer())
      .get(endpoint)
      .expect(200);

    const cachedItemAfterCall = await cacheManager.get(endpoint);

    expect(cachedItemBeforeCall).toEqual(null);
    expect(cachedItemAfterCall).toBeDefined();
  });

  it('should use cached response', async () => {
    const endpoint = '/api-proxy/films/1';

    const cacheGetSpy = jest.spyOn(cacheManager, 'get');
    const serviceGetSpy = jest.spyOn(apiProxyService, 'getFilmById');

    const responseFirstCall = await request(app.getHttpServer())
      .get(endpoint)
      .expect(200);
    const responseSecondCall = await request(app.getHttpServer())
      .get(endpoint)
      .expect(200);

    expect(cacheGetSpy).toHaveBeenCalled();
    expect(serviceGetSpy).toHaveBeenCalledTimes(1);
  });

  afterEach(async () => {
    await app.close();
  });
});
