import React, { useState, useEffect, useMemo } from "react";
import service from "../../Services/api";
import { config } from "../../Config";

function FilesTable({ refreshTrigger, newlyAddedFile }) {
  const [files, setFiles] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "created", direction: "descending" });
  const [copiedUrl, setCopiedUrl] = useState(null);

  useEffect(() => {
    const fetchAddressList = async () => {
      const response = await service.getFiles();
      console.log(response);
      setFiles(response);
    };

    fetchAddressList();
  }, [refreshTrigger]);

  const sortedFiles = useMemo(() => {
    let sortableItems = [...files];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (sortConfig.key === "created") {
          return sortConfig.direction === "ascending"
            ? new Date(aValue) - new Date(bValue)
            : new Date(bValue) - new Date(aValue);
        }

        if (typeof aValue === "string") {
          return sortConfig.direction === "ascending"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        // for numbers
        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [files, sortConfig]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopiedUrl(text);
        setTimeout(() => setCopiedUrl(null), 2000); // Reset after 2 seconds
      },
      (err) => {
        console.error("Failed to copy text: ", err);
        alert("Failed to copy URL.");
      }
    );
  };

  const handleDelete = async (fileName) => {
    if (window.confirm(`Are you sure you want to delete the file: ${fileName}?`)) {
      try {
        await service.deleteFile(fileName);
        // Remove the file from the state to update the UI instantly
        setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
      } catch (error) {
        console.error("Failed to delete file:", error);
        // Optionally, show an error message to the user
        alert(`Error deleting file: ${error.message}`);
      }
    }
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (name) => {
    if (sortConfig.key !== name) {
      return null;
    }
    return sortConfig.direction === "ascending" ? " ▲" : " ▼";
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return "";
    }
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  return (
    <div className="address-table-container">
      <h2>List of files</h2>
      <table className="blueTable">
        <thead>
          <tr>
            <th onClick={() => requestSort("name")} style={{ cursor: "pointer" }}>
              Name{getSortIndicator("name")}
            </th>
            <th>URL</th>
            <th onClick={() => requestSort("size")} style={{ cursor: "pointer" }}>
              Size{getSortIndicator("size")}
            </th>
            <th onClick={() => requestSort("created")} style={{ cursor: "pointer" }}>
              Added{getSortIndicator("created")}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedFiles &&
            sortedFiles.map((file) => (
              <tr
                key={file.name}
                style={file.name === newlyAddedFile ? { fontWeight: "bold" } : {}}
              >
                <td>{file.name}</td>
                <td>
                  <a href={`${config.fileUrl}/${file.name}`} target="_blank" rel="noopener noreferrer" className="file-url-link">
                    {`${config.fileUrl}/${file.name}`}
                  </a>
                  <button onClick={() => copyToClipboard(`${config.fileUrl}/${file.name}`)} className="copy-button" title="Copy to clipboard">
                    <img src="copy.png" alt="Copy to clipboard" />
                  </button>
                  {copiedUrl === `${config.fileUrl}/${file.name}` && (
                    <span style={{ marginLeft: "5px", color: "green", fontStyle: "italic" }}>
                      Copied to clipboard!
                    </span>
                  )}
                </td>
                <td>{file.size} MB</td>
                <td>{formatDate(file.created)}</td>
                <td>
                  <button onClick={() => handleDelete(file.name)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default FilesTable;
