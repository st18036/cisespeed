import { useState, useEffect } from "react";
import SortableTable from "../../components/table/SortableTable";
import formStyles from "../../styles/Form.module.scss";

interface ArticlesInterface {
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
  rating: { average: number; count: number };
}

const Articles = () => {
  const [articles, setArticles] = useState<ArticlesInterface[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedClaim, setSelectedClaim] = useState<string | null>(null);
  const [selectedPractice, setSelectedPractice] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Record<string, number | string>>({});
  const [columnVisibility, setColumnVisibility] = useState<boolean[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchArticles = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles`);
      const data = await res.json();
      const approvedArticles = data.filter((article: any) => article.status === "approved");
      setArticles(approvedArticles);
    };

    fetchArticles();
  }, []);

  const headers: { key: keyof ArticlesInterface | "rating"; label: string }[] = [
    { key: "title", label: "Title" },
    { key: "authors", label: "Authors" },
    { key: "rating", label: "Rating" },
    { key: "source", label: "Source" },
    { key: "pubyear", label: "Publication Year" },
    { key: "doi", label: "DOI" },
    { key: "claim", label: "Claim" },
    { key: "evidence", label: "Evidence" },
    { key: "research", label: "Research" },
    { key: "participant", label: "Participant" },
  ];

  // Initialize column visibility
  useEffect(() => {
    if (columnVisibility.length === 0) {
      setColumnVisibility(Array(headers.length).fill(true));
    }
  }, [columnVisibility.length]);

  // Handle rating change
  const handleRatingChange = async (id: string, newRating: number) => {
    const article = articles.find((a) => a.id === id);

    if (!article) return;

    // Update the state with the new rating locally
    setRatings((prevRatings) => ({
      ...prevRatings,
      [id]: newRating,
    }));

    // Send the new rating to the backend
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${id}/rate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rating: newRating,
      }),
    });
  };

  // Filter articles based on search query, claim, and practice
  const filteredArticles = articles.filter((article) => {
    const matchesSearchQuery = Object.keys(article).some((key) => {
      const value = article[key as keyof ArticlesInterface];
      return value?.toString().toLowerCase().includes(searchQuery.toLowerCase());
    });

    const matchesClaim = selectedClaim ? article.claim === selectedClaim : true;
    const matchesPractice = selectedPractice ? article.evidence?.toLowerCase().includes(selectedPractice.toLowerCase()) : true;

    return matchesSearchQuery && matchesClaim && matchesPractice;
  });

  const toggleColumn = (index: number) => {
    setColumnVisibility((prevVisibility) => {
      const newVisibility = [...prevVisibility];
      newVisibility[index] = !newVisibility[index];
      return newVisibility;
    });
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  return (
    <main id="main">
      <h1 className="projectName">Articles Index Page</h1>

      <div style={{ display: "flex", alignItems: "center", gap: "2em", marginBottom: "1em", flexWrap: "wrap" }}>
        {/* Search input */}
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={formStyles.formItem}
          style={{ width: "100%", maxWidth: "20em" }}
        />

        {/* Select Claim Dropdown */}
        <div>
          <label htmlFor="claim" style={{ marginRight: "0.5em" }}>
            Select Claim:
          </label>
          <select
            id="claim"
            value={selectedClaim || ""}
            onChange={(e) => setSelectedClaim(e.target.value || null)}
            className={formStyles.formItem}
          >
            <option value="">All Claims</option>
            {/* Your claim options here */}
          </select>
        </div>

        {/* SE Practices Dropdown */}
        <div>
          <label htmlFor="sePractices" style={{ marginRight: "0.5em" }}>
            Select SE Practice:
          </label>
          <select
            id="sePractices"
            value={selectedPractice || ""}
            onChange={(e) => setSelectedPractice(e.target.value || null)}
            className={formStyles.formItem}
          >
            <option value="">All Practices</option>
            {/* Your SE practices options here */}
          </select>
        </div>

        {/* Hide Columns Dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={toggleDropdown}
            className={formStyles.formItem}
            style={{ cursor: "pointer", padding: "0.5em 1em" }}
          >
            {dropdownOpen ? "Hide Columns ▼" : "Hide Columns ▶"}
          </button>

          {dropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "3em",
                left: 0,
                backgroundColor: "#fff",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                padding: "1em",
                zIndex: 1000,
              }}
            >
              {headers.map((header, index) => (
                <div key={header.key} style={{ marginBottom: "0.5em" }}>
                  <input
                    type="checkbox"
                    checked={columnVisibility[index]}
                    onChange={() => toggleColumn(index)}
                  />
                  <label style={{ marginLeft: "0.5em" }}>{header.label}</label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sortable table with filtered articles and rating column */}
      <SortableTable
        headers={headers.filter((_, index) => columnVisibility[index])}
        data={filteredArticles.map((article) => ({
          ...article,
          rating: (
            <div>
              <div style={{ marginBottom: "0.5em" }}>
                <strong>Average Rating:</strong>{" "}
                <span style={{ color: "gold" }}>{article.rating.average.toFixed(2)} ⭐</span> (
                {article.rating.count} ratings)
              </div>
              <div>
                <select
                  onChange={(e) => handleRatingChange(article.id, Number(e.target.value))}
                  value={ratings[article.id] || ""}
                  className={formStyles.formItem}
                  style={{ padding: "5px", width: "100%" }}
                >
                  <option value="">Rate</option>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <option key={star} value={star}>
                      {star} ⭐
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ),
        }))}
      />
    </main>
  );
};

export default Articles;
