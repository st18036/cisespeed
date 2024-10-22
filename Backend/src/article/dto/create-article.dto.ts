export class CreateArticleDto {
  title: string;
  authors: string[];
  source: string;
  pubyear: number;
  doi: string;
  claim?: string;
  evidence?: string;
  status: string;
  research: string;
  participant: string;
  email: string;
}
