/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextPage } from "next";
import { useState, useEffect } from "react";
import SortableTable from "../components/table/SortableTable";

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

const ModeratorPage: NextPage = () => {
  const [articles, setArticles] = useState<ArticleInterface[]>([]);
  const [selectedEvidence, setSelectedEvidence] = useState<Record<string, string>>({});
  const [selectedResearch, setSelectedResearch] = useState<Record<string, string>>({});
  const [selectedParticipant, setSelectedParticipant] = useState<Record<string, string>>({});
  const [duplicateIndicators, setDuplicateIndicators] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    checkForDuplicates();
  }, [articles]);

  const checkForDuplicates = () => {
    const seenArticles: Record<string, boolean> = {};
    const duplicates: Record<string, boolean> = {};

    articles.forEach(article => {
      const key = `${article.title}-${article.pubyear}-${article.authors.join(',')}`;
      if (seenArticles[key]) {
        duplicates[article.id] = true; // Mark as duplicate
      } else {
        seenArticles[key] = true; // Mark as seen
      }
    });

    setDuplicateIndicators(duplicates);
  };

  const handleApproval = async (id: string, status: string) => {
    const evidence = selectedEvidence[id];
    const research = selectedResearch[id];
    const participant = selectedParticipant[id];

    if (!evidence || !research || !participant) {
      alert("Please select evidence, research, and participant before proceeding.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/articles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, evidence, research, participant }),
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
          { key: "research", label: "Research Type" },
          { key: "participant", label: "Participant Type" },
          { key: "status", label: "Status" },
          { key: "duplicate", label: "Duplicate Indicator" }, // New column for duplicate indicator
        ]}
        data={articles.map((article) => ({
          ...article,
          evidence: (
            <select
              value={selectedEvidence[article.id] || ""}
              onChange={(e) => setSelectedEvidence({ ...selectedEvidence, [article.id]: e.target.value })}
            >
              <option value="">Select Evidence</option>
              <option value="Agree">Agree</option>
              <option value="Disagree">Disagree</option>
              <option value="Mixed">Mixed</option>
            </select>
          ),
          research: (
            <select
              value={selectedResearch[article.id] || ""}
              onChange={(e) => setSelectedResearch({ ...selectedResearch, [article.id]: e.target.value })}
            >
              <option value="">Select Research</option>
              <option value="Research Study">Research Study</option>
              <option value="Expert Opinion">Expert Opinion</option>
              <option value="Statistical Data">Statistical Data</option>
              <option value="Case Study">Case Study</option>
              <option value="Historical Data">Historical Data</option>
            </select>
          ),
          participant: (
            <select
              value={selectedParticipant[article.id] || ""}
              onChange={(e) => setSelectedParticipant({ ...selectedParticipant, [article.id]: e.target.value })}
            >
              <option value="">Select Participant</option>
              <option value="Student">Student</option>
              <option value="Practitioner">Practitioner</option>
              <option value="Expert">Expert</option>
              <option value="No Participant">No Participant</option>
            </select>
          ),
          status: (
            <div>
              <button onClick={() => handleApproval(article.id, "approved")}>Approve</button>
              <button onClick={() => handleApproval(article.id, "rejected")}>Reject</button>
            </div>
          ),
          duplicate: (
            <span className={duplicateIndicators[article.id] ? "duplicate" : "not-duplicate"}>
              {duplicateIndicators[article.id] ? "Duplicate" : "Not Duplicate"}
            </span>
          ),
        }))}
      />
    </div>
  );
};

export default ModeratorPage;
