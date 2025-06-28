import { useState } from "react";
import './App.css';
import FilesTable from './Components/FilesTable';
import FileUpload from './Components/FileUpload';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [newlyAddedFile, setNewlyAddedFile] = useState(null);

  const handleUploadSuccess = (fileName) => {
    setRefreshTrigger(prev => prev + 1);
    setNewlyAddedFile(fileName);
  };

  return (
    <div className="App">
      <FileUpload onUploadSuccess={handleUploadSuccess}></FileUpload>
      <FilesTable refreshTrigger={refreshTrigger} newlyAddedFile={newlyAddedFile}></FilesTable>
    </div>
  );
}

export default App;
