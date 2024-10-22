import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import mongoose from 'mongoose';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let createdArticleId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // Import your main app module
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close(); // Ensure app is closed after all tests
  });

  // Test GET /articles
  it('/articles (GET)', () => {
    return request(app.getHttpServer())
      .get('/articles')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true); // Expect array of articles
        if (res.body.length > 0) {
          const article = res.body[0];
          expect(article).toHaveProperty('title');
          expect(article).toHaveProperty('authors');
          expect(article).toHaveProperty('pubyear');
        }
      });
  });

  // Test POST /articles
  it('/articles (POST)', async () => {
    return request(app.getHttpServer())
      .post('/articles')
      .send({
        title: 'New Article',
        authors: ['John Doe'],
        pubyear: 2024,
        claim: 'Product quality improvement',
        evidence: 'Strong support',
        doi: '10.1234/test-doi', // Add doi field
        source: 'Test Source', // Add source field
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('_id');
        expect(res.body).toHaveProperty('title', 'New Article');
        createdArticleId = res.body._id; // Save the created article's ID for further tests
      });
  });

  // Test GET /articles/:id
  it('/articles/:id (GET)', async () => {
    return request(app.getHttpServer())
      .get(`/articles/${createdArticleId}`) // Use the created article's ID
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('_id', createdArticleId); // Ensure the correct article is returned
        expect(res.body).toHaveProperty('title', 'New Article');
      });
  });
});
