import { FormEvent, useState } from "react";
import formStyles from "../../styles/Form.module.scss";


const NewDiscussion = () => {
  const [title, setTitle] = useState<string>("");
  const [authors, setAuthors] = useState<string[]>([]);
  const [source, setSource] = useState<string>("");
  const [pubYear, setPubYear] = useState<number | null>(null);
  const [doi, setDoi] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [email, setEmail] = useState<string>(""); // New state for email
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);


  
  const submitNewArticle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();



    const newArticle = {
      title,
      authors: authors.filter(author => author.trim() !== ""),
      source: source.trim() || null,
      pubyear: pubYear !== null ? pubYear : null,
      doi: doi.trim() || null,
      claim: summary.trim() || null,
      status: "pending", // Ensure status is pending
      email: email.trim() || null, // Include email in the new article data
    };

    try {
      const res = await fetch("http://localhost:3001/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newArticle),
      });

      if (res.ok) {
        setSuccess(true);
        // Reset form fields
        setTitle("");
        setAuthors([]);
        setSource("");
        setPubYear(null);
        setDoi("");
        setSummary("");
        setEmail(""); // Reset email
        setError(null);
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to submit article");
      }
    } catch {
      setError("Failed to submit article. Please try again.");
    }
  };

  const addAuthor = () => {
    setAuthors([...authors, ""]);
  };

  const removeAuthor = (index: number) => {
    setAuthors(authors.filter((_, i) => i !== index));
  };

  const changeAuthor = (index: number, value: string) => {
    setAuthors(
      authors.map((oldValue, i) => {
        return index === i ? value : oldValue;
      })
    );
  };

  return (
    <div className="center-container">
      <div className="form-container">
        <h1>New Article</h1>
        {success && <p style={{ color: "green" }}>Article submitted successfully and is now pending approval.</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form className={formStyles.form} onSubmit={submitNewArticle}>
          <label htmlFor="title">Title:</label>
          <input
            className={formStyles.formItem}
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <label htmlFor="author">Authors (optional):</label>
          {authors.map((author, index) => (
            <div key={`author-${index}`} className={formStyles.arrayItem}>
              <input
                type="text"
                name="author"
                value={author}
                onChange={(event) => changeAuthor(index, event.target.value)}
                className={formStyles.formItem}
              />
              <button
                onClick={() => removeAuthor(index)}
                className={formStyles.buttonItem}
                style={{ marginLeft: "3rem" }}
                type="button"
              >
                -
              </button>
            </div>
          ))}
          <button
            onClick={addAuthor}
            className={formStyles.buttonItem}
            style={{ marginLeft: "auto" }}
            type="button"
          >
            +
          </button>

          <label htmlFor="source">Source (optional):</label>
          <input
            className={formStyles.formItem}
            type="text"
            name="source"
            id="source"
            value={source}
            onChange={(event) => setSource(event.target.value)}
          />

          <label htmlFor="pubYear">Publication Year (optional):</label>
          <input
            className={formStyles.formItem}
            type="number"
            name="pubYear"
            id="pubYear"
            value={pubYear !== null ? pubYear : ""}
            onChange={(event) => {
              const val = event.target.value;
              setPubYear(val === "" ? null : parseInt(val));
            }}
          />

          <label htmlFor="doi">DOI (optional):</label>
          <input
            className={formStyles.formItem}
            type="text"
            name="doi"
            id="doi"
            value={doi}
            onChange={(event) => setDoi(event.target.value)}
          />

          <label htmlFor="summary">Summary (optional):</label>
          <textarea
            className={formStyles.formTextArea}
            name="summary"
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
          />

          <label htmlFor="email">Your Email:</label> {/* New email field */}
          <input
            className={formStyles.formItem}
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required // Ensure this field is required
          />

          <button className={formStyles.formItem} type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewDiscussion;
