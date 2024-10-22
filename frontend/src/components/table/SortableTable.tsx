import React from "react";

interface SortableTableProps {
  headers: { key: string; label: string }[];
  data: any[];
}

const SortableTable: React.FC<SortableTableProps> = ({ headers, data }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
      <thead>
        <tr>
          {headers.map((header) => (
            <th
              key={header.key}
              style={{
                padding: "16px",  // Increased padding for better spacing
                borderBottom: "2px solid #ddd",
                backgroundColor: "#f9f9f9",
                textAlign: "left",
                width: getColumnWidth(header.key),  // Dynamic column width
                minWidth: "80px",  // Ensures a reasonable minimum width
              }}
            >
              {header.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((row, i) => (
            <tr key={i}>
              {headers.map((header) => (
                <td
                  key={header.key}
                  style={{
                    padding: "16px",  // Increased padding for better spacing
                    borderBottom: "1px solid #ddd",
                    textAlign: "left",
                    whiteSpace: "normal",  // Allows text to wrap within the cells
                    wordWrap: "break-word",
                    maxWidth: "200px",  // Max width for cells (especially for title)
                    overflow: "hidden",
                    textOverflow: "ellipsis",  // Adds ellipsis for long text
                  }}
                  title={row[header.key]} // Tooltip to show full content on hover
                >
                  {row[header.key]}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={headers.length} style={{ padding: "16px", textAlign: "center" }}>
              No data available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

// Helper function to assign widths to certain columns
const getColumnWidth = (key: string) => {
  switch (key) {
    case "title":
      return "30%";  // Make the title column wider
    case "authors":
      return "20%";  // Adjusted width for authors
    case "source":
      return "15%";  // Added width for source
    case "pubyear":
      return "10%";  // Added width for publication year
    case "doi":
      return "15%";  // Width for DOI
    case "claim":
      return "20%";  // Width for claim
    case "evidence":
      return "15%";  // Width for evidence
    case "status":
      return "10%";  // Width for status buttons
    default:
      return "auto";  // Default for other columns
  }
};

export default SortableTable;
