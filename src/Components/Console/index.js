import FilesTable from "../FilesTable";
import FileUpload from "../FileUpload";
import Context from "../../Session/Context";
import { useState } from "react";

function Console() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [newlyAddedFile, setNewlyAddedFile] = useState(null);

  const handleUploadSuccess = (fileName) => {
    setRefreshTrigger((prev) => prev + 1);
    setNewlyAddedFile(fileName);
  };
  return (
    <div>
      <Context></Context>
      <FileUpload onUploadSuccess={handleUploadSuccess}></FileUpload>
      <FilesTable
        refreshTrigger={refreshTrigger}
        newlyAddedFile={newlyAddedFile}
      ></FilesTable>
    </div>
  );
}

export default Console;
