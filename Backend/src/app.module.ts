import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleModule } from './article/article.module';
import * as dotenv from 'dotenv';

dotenv.config(); 

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI),
    ArticleModule,
  ],
})
export class AppModule {}
