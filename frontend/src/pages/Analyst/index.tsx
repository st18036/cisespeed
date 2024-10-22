import { NextPage } from "next";
import { useState, useEffect } from "react";
import SortableTable from "../../components/table/SortableTable";

interface ArticleInterface {
  id: string;
  title: string;
  authors: string[];
  source: string;
  pubyear: number;
  doi: string;
  claim: string;
  evidence: string;
  status: string;
  research: string;
  participant: string;
}

const AnalystPage: NextPage = () => {
  const [articles, setArticles] = useState<ArticleInterface[]>([]);
  const [extractedData, setExtractedData] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);

  // Fetch only approved articles
  const fetchArticles = async () => {
    try {
      const res = await fetch("http://localhost:3001/articles");
      const data = await res.json();
      if (Array.isArray(data)) {
        const approvedArticles = data.filter((article: any) => article.status === 'approved');
        setArticles(approvedArticles.map((article: any) => ({
          id: article._id,
          title: article.title,
          authors: article.authors,
          source: article.source,
          pubyear: article.pubyear,
          doi: article.doi,
          claim: article.claim,
          evidence: article.evidence,
          status: article.status,
          research: article.research,
          participant: article.participant,
        })));
      }
    } catch (err) {
      console.error("Error fetching articles:", err);
      setError("Failed to fetch articles. Please try again later.");
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleExtract = (article: ArticleInterface) => {
    const dataToExtract = {
      title: article.title,
      authors: article.authors.join(", "),
      evidence: article.evidence,
      claim: article.claim,
      research: article.research,
      participant: article.participant,
      doi: article.doi,
      source: article.source,
    };

    setExtractedData((prevData) => ({
      ...prevData,
      [article.id]: dataToExtract,
    }));

    // Simulate saving data to database (you can replace this with actual database logic)
    console.log("Data extracted and ready for saving:", dataToExtract);
  };

  return (
    <div className="container">
      <h1>Analyst Page</h1>
      <p>Extract key data from approved articles:</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <SortableTable
        headers={[
          { key: "title", label: "Title" },
          { key: "authors", label: "Authors" },
          { key: "source", label: "Source" },
          { key: "pubyear", label: "Publication Year" },
          { key: "doi", label: "DOI" },
          { key: "claim", label: "Claim" },
          { key: "evidence", label: "Evidence" },
          { key: "research", label: "Research Type" },
          { key: "participant", label: "Participant Type" },
        ]}
        data={articles.map((article) => ({
          ...article,
          extract: (
            <button onClick={() => handleExtract(article)}>
              Extract Data
            </button>
          ),
        }))}
      />

      {Object.keys(extractedData).length > 0 && (
        <div className="extracted-data-section">
          <h2>Extracted Data</h2>
          {Object.keys(extractedData).map((articleId) => (
            <div key={articleId}>
              <h3>{extractedData[articleId].title}</h3>
              <p><strong>Authors:</strong> {extractedData[articleId].authors}</p>
              <p><strong>Evidence:</strong> {extractedData[articleId].evidence}</p>
              <p><strong>Claim:</strong> {extractedData[articleId].claim}</p>
              <p><strong>Research Type:</strong> {extractedData[articleId].research}</p>
              <p><strong>Participant Type:</strong> {extractedData[articleId].participant}</p>
              <p><strong>DOI:</strong> {extractedData[articleId].doi}</p>
              <p><strong>Source:</strong> {extractedData[articleId].source}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalystPage;
