import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CacheModule } from '@nestjs/cache-manager';

import { Cache } from 'cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { INestApplication } from '@nestjs/common';
require('dotenv').config();

describe('cache', () => {
  let app: INestApplication;
  let cacheManager: Cache;
  let endpoint = 'api-proxy/films/1';
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        CacheModule.register({
          store: redisStore,
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
          db: 1,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    cacheManager = app.get(CacheModule);

    await app.init();

    if (cacheManager.get(endpoint)) {
      cacheManager.del(endpoint);
    }
  });

  it('should cached response', async () => {
    const responseFirstCall = await request(app.getHttpServer())
      .get(endpoint)
      .expect(200);
    const cachedItemFirstCall = cacheManager.get(endpoint);
    expect(cachedItemFirstCall).toEqual(undefined);

    const responseSecondCall = await request(app.getHttpServer())
      .get(endpoint)
      .expect(200);
    const cachedItemSecondCall = cacheManager.get(endpoint);

    expect(cacheManager.get).toHaveBeenCalledTimes(1);
    expect(cacheManager.set).toHaveBeenCalledTimes(1);

    afterAll(async () => {
      await app.close();
    });
  });
});
