import React, { useState, useEffect } from "react";
import service from "../../Services/api";
import { config } from "../../Config";

function FilesTable() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchAddressList = async () => {
      const response = await service.getFiles();
      console.log(response);
      setFiles(response);
    };

    fetchAddressList();
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        // You can add a notification here for better user experience
        console.log("Copied to clipboard:", text);
      },
      (err) => {
        console.error("Failed to copy text: ", err);
      }
    );
  };

  return (
    <div className="address-table-container">
      <h2>List of files</h2>
      <table className="blueTable">
        <thead>
          <tr>
            <th>Name</th>
            <th>URL</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {files &&
            files.map((file) => (
              <tr key={file}>
                <td>{file}</td>
                <td>{`${config.fileUrl}/${file}`}</td>
                <td>
                  <button onClick={() => copyToClipboard(`${config.fileUrl}/${file}`)}>
                    Copy to clipboard
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
