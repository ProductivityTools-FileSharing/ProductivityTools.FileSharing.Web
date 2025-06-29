import React, { useState, useEffect, useMemo, useRef } from "react";
import service from "../../Services/api";
import { config } from "../../Config";
import { useAuth } from "../../Session/AuthContext";

function FilesTable({ refreshTrigger, newlyAddedFile }) {
  const [files, setFiles] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "created",
    direction: "descending",
  });
  const [copiedUrl, setCopiedUrl] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const selectAllCheckboxRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAddressList = async () => {
      const response = await service.getFiles();
      console.log(response);
      setFiles(response || []); // Ensure files is always an array
    };

    // Only fetch files if the user is authenticated.
    if (user) {
      fetchAddressList();
    } else {
      setFiles([]); // Clear files if user logs out or is not present
    }
  }, [refreshTrigger, user]);

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

  useEffect(() => {
    if (selectAllCheckboxRef.current && sortedFiles) {
      const isIndeterminate =
        selectedFiles.size > 0 && selectedFiles.size < sortedFiles.length;
      selectAllCheckboxRef.current.indeterminate = isIndeterminate;
    }
  }, [selectedFiles, sortedFiles]);

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
    if (
      window.confirm(`Are you sure you want to delete the file: ${fileName}?`)
    ) {
      try {
        await service.deleteFile(fileName);
        // Remove the file from the state to update the UI instantly
        setFiles((prevFiles) =>
          prevFiles.filter((file) => file.name !== fileName)
        );
      } catch (error) {
        console.error("Failed to delete file:", error);
        // Optionally, show an error message to the user
        alert(`Error deleting file: ${error.message}`);
      }
    }
  };

  const handleSelectFile = (fileName) => {
    setSelectedFiles((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(fileName)) {
        newSelected.delete(fileName);
      } else {
        newSelected.add(fileName);
      }
      return newSelected;
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allFileNames = new Set(sortedFiles.map((f) => f.name));
      setSelectedFiles(allFileNames);
    } else {
      setSelectedFiles(new Set());
    }
  };

  const handleBulkDelete = async () => {
    const filesToDelete = Array.from(selectedFiles);
    if (filesToDelete.length === 0) {
      alert("No files selected for deletion.");
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to delete ${filesToDelete.length} selected file(s)?`
      )
    ) {
      try {
        await Promise.all(
          filesToDelete.map((fileName) => service.deleteFile(fileName))
        );
        setFiles((prevFiles) =>
          prevFiles.filter((file) => !selectedFiles.has(file.name))
        );
        setSelectedFiles(new Set());
        alert(`${filesToDelete.length} file(s) deleted successfully.`);
      } catch (error) {
        console.error("Failed to delete one or more files:", error);
        alert(
          `Error deleting files: ${error.message}. Some files may not have been deleted.`
        );
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
            <th>
              <input
                ref={selectAllCheckboxRef}
                type="checkbox"
                onChange={handleSelectAll}
                checked={
                  sortedFiles?.length > 0 &&
                  selectedFiles.size === sortedFiles.length
                }
              />
            </th>
            <th
              onClick={() => requestSort("name")}
              style={{ cursor: "pointer" }}
            >
              Name{getSortIndicator("name")}
            </th>
            <th>URL</th>
            <th
              onClick={() => requestSort("size")}
              style={{ cursor: "pointer" }}
            >
              Size{getSortIndicator("size")}
            </th>
            <th
              onClick={() => requestSort("created")}
              style={{ cursor: "pointer" }}
            >
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
                style={
                  file.name === newlyAddedFile ? { fontWeight: "bold" } : {}
                }
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedFiles.has(file.name)}
                    onChange={() => handleSelectFile(file.name)}
                  />
                </td>
                <td>{file.name}</td>
                <td>
                  {(!copiedUrl ||
                    copiedUrl != `${config.fileUrl}/${file.name}`) && (
                    <span>
                      <a
                        href={`${config.fileUrl}/${file.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="file-url-link"
                      >
                        {`${config.fileUrl}/${file.name}`}
                      </a>

                      <button
                        onClick={() =>
                          copyToClipboard(`${config.fileUrl}/${file.name}`)
                        }
                        className="copy-button"
                        title="Copy to clipboard"
                      >
                        <img src="copy.png" alt="Copy to clipboard" />
                      </button>
                    </span>
                  )}
                  {copiedUrl === `${config.fileUrl}/${file.name}` && (
                    <span
                      style={{
                        marginLeft: "5px",
                        color: "green",
                        fontStyle: "italic",
                      }}
                    >
                      URL copied to clipboard!
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
      <div style={{ marginTop: "10px" }}>
        <button onClick={handleBulkDelete} disabled={selectedFiles.size === 0}>
          Delete Selected ({selectedFiles.size})
        </button>
      </div>
    </div>
  );
}

export default FilesTable;
