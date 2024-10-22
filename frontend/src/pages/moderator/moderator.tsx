/* eslint-disable @typescript-eslint/no-explicit-any */
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
}

const ModeratorPage: NextPage = () => {
  const [articles, setArticles] = useState<ArticleInterface[]>([]);
  const [selectedEvidence, setSelectedEvidence] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const evidenceOptions = [
    { label: "Evidence 1", value: "evidence1" },
    { label: "Evidence 2", value: "evidence2" },
    { label: "Evidence 3", value: "evidence3" },
    // Add more evidence options as needed
  ];

  const fetchArticles = async () => {
    try {
      const res = await fetch("http://localhost:3001/articles");
      const data = await res.json();
      if (Array.isArray(data)) {
        const pendingArticles = data.filter((article: any) => article.status === 'pending');
        setArticles(pendingArticles.map((article: any) => ({
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
      }
    } catch (err) {
      console.error("Error fetching articles:", err);
      setError("Failed to fetch articles. Please try again later.");
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleApproval = async (id: string, status: string) => {
    const evidence = selectedEvidence[id];
    if (!evidence) {
      alert("Please select evidence before proceeding.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/articles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, evidence }),
      });

      if (res.ok) {
        fetchArticles(); // Re-fetch articles to update the list
      } else {
        const errorData = await res.json();
        console.error("Failed to update article status:", errorData.message);
      }
    } catch (err) {
      console.error("Error updating article status:", err);
    }
  };

  // Check for duplicates (you should implement this function to check against your dataset)
  const isDuplicate = (article: ArticleInterface): boolean => {
    // Example: Check if an article title already exists in the articles list
    return articles.some((a) => a.title === article.title && a.id !== article.id);
  };

  return (
    <div className="container">
      <h1>Moderator Page</h1>
      <p>Manage articles by approving or rejecting them:</p>

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
          { key: "status", label: "Status" },
        ]}
        data={articles.map((article) => ({
          ...article,
          evidence: (
            <select
              value={selectedEvidence[article.id] || ""}
              onChange={(e) => setSelectedEvidence({ ...selectedEvidence, [article.id]: e.target.value })}
            >
              <option value="">Select Evidence</option>
              {evidenceOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          ),
          status: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button onClick={() => handleApproval(article.id, "approved")}>Approve</button>
              <button onClick={() => handleApproval(article.id, "rejected")}>Reject</button>
              {isDuplicate(article) && (
                <span style={{ color: 'red', marginLeft: '8px' }}>(Duplicate)</span>
              )}
            </div>
          ),
        }))}
      />
    </div>
  );
};

export default ModeratorPage;
