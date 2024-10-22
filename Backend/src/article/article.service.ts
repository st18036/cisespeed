import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Article } from './article.interface'; 
import { CreateArticleDto } from './dto/create-article.dto'; 

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel('Speed') private readonly articleModel: Model<Article>
  ) {}

  // Find all articles
  async findAll(): Promise<Article[]> {
    return this.articleModel.find().exec();
  }

  // Find all approved articles
  async findApproved(): Promise<Article[]> {
    return this.articleModel.find({ status: 'approved' }).exec();
  }

  // Create a new article
  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const lastArticle = await this.articleModel.findOne().sort({ id: -1 }).exec();
    const newId = lastArticle ? (parseInt(lastArticle.id) + 1).toString() : "1";

    const newArticle = new this.articleModel({
      ...createArticleDto,
      id: newId,
      status: 'pending',
      rating: { average: 0, count: 0 }, // Initialize rating with default values
    });

    return newArticle.save();
  }

  // Update the status of an article
  async updateStatus(id: string, status: string, evidence: string, research: string, participant: string): Promise<Article | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ObjectId');
    }
    
    const article = await this.articleModel.findById(id).exec();
    
    if (article) {
      article.status = status;
      article.evidence = evidence;
      article.research = research;
      article.participant = participant;
      await article.save();
      return article;
    }

    return null;
  }

  // Update the rating of an article
  async updateRating(id: string, newRating: number): Promise<Article | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ObjectId');
    }

    const article = await this.articleModel.findById(id).exec();
    
    if (article) {
      const currentAverage = article.rating.average;
      const currentCount = article.rating.count;

      // Calculate the new average rating
      const updatedCount = currentCount + 1;
      const updatedAverage = (currentAverage * currentCount + newRating) / updatedCount;

      // Update the article with the new rating
      article.rating.average = updatedAverage;
      article.rating.count = updatedCount;

      await article.save();
      return article;
    }

    return null;
  }

  // Find one article by id
  async findOneById(id: string): Promise<Article | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ObjectId');
    }

    return this.articleModel.findById(id).exec();
  }
}
