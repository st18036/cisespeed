import { NextPage } from "next";
import { useEffect, useState } from "react";
import SortableTable from "../../components/table/SortableTable";
import formStyles from "../../styles/Form.module.scss"; // Import the styles

interface ArticlesInterface {
  id: string;
  title: string;
  authors: string[];
  source: string;
  pubyear: number;
  doi: string;
  claim?: string;
  evidence?: string;
  status: string;
}

const RejectedPage: NextPage = () => {
  const [articles, setArticles] = useState<ArticlesInterface[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(""); // State for search query
  const [error, setError] = useState<string | null>(null);

  const headers: { key: keyof ArticlesInterface; label: string }[] = [
    { key: "title", label: "Title" },
    { key: "authors", label: "Authors" },
    { key: "source", label: "Source" },
    { key: "pubyear", label: "Publication Year" },
    { key: "doi", label: "DOI" },
    { key: "claim", label: "Claim" },
    { key: "evidence", label: "Evidence" },
    { key: "status", label: "Status" },
  ];

  useEffect(() => {
    const fetchRejectedArticles = async () => {
      try {
        const res = await fetch("http://localhost:3001/articles");
        const data = await res.json();

        if (Array.isArray(data)) {
          const rejectedArticles = data.filter((article: any) => article.status === 'rejected');
          setArticles(rejectedArticles.map((article: any) => ({
            id: article._id,
            title: article.title,
            authors: article.authors,
            source: article.source,
            pubyear: article.pubyear,
            doi: article.doi,
            claim: article.claim,
            evidence: article.evidence,
            status: article.status,
          })));
        } else {
          console.error("Data fetched is not an array:", data);
          setArticles([]);
        }
      } catch (err) {
        console.error("Error fetching rejected articles:", err);
        setError("Failed to fetch rejected articles. Please try again later.");
      }
    };

    fetchRejectedArticles();
  }, []);

  // Filter articles based on search query
  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    article.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container">
      <h1>Rejected Articles</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search articles..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={formStyles.formItem} // Use form styles for consistency
        style={{
          marginBottom: "1em",
          width: "100%",
          maxWidth: "30em", // Optional: limit the width
        }}
      />

      <SortableTable
        headers={headers}
        data={filteredArticles.map((article) => ({
          ...article,
          status: article.status,
        }))}
      />
    </div>
  );
};

export default RejectedPage;
