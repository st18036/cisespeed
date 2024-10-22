export interface Article {
  id: string;
  title: string;
  authors: string[];
  source: string | null;
  pubyear: number | null;
  doi: string | null;
  claim: string | null;
  evidence: string | null;
  research: string | null;
  participant: string | null;
  status: string;
  rating: {
    average: number;
    count: number;
  };  
}
