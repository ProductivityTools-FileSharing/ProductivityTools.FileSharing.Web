import axios from "axios";
import { useEffect, useState } from "react";
import service from "../../Services/api";

function FileUpload({ onUploadSuccess }) {
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState();
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const [uploadResponse, setUploadResponse] = useState();
  const [uploadResponseText, setUploadResponseText] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [fileInputWorkaroundKey, setFileInputWorkaroundKey] = useState(
    Date.now()
  );

  useEffect(() => {
    if (uploadInProgress) {
      const timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
      return () => {
        clearInterval(timer);
        setElapsedTime(0);
      };
    }
  }, [uploadInProgress]);

  useEffect(() => {
    if (uploadResponse) {
      if (uploadResponse.status == 200) {
        setUploadResponseText("Dodano plik");
        setFile(null);
        setFileName(null);
        setUploadResponse("");
        setUploadInProgress(false);
        setFileInputWorkaroundKey(Date.now());
        if (onUploadSuccess) {
          onUploadSuccess(fileName);
        }
      } else {
        setUploadResponseText("Coś się stało", uploadResponse.statusText);
        setUploadInProgress(false);
      }
    }
  }, [uploadResponse, onUploadSuccess]);

  const saveFile = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const uploadFile = async (e) => {
    setUploadInProgress(true);
    setUploadResponse("");
    const formData = new FormData();
    formData.append("formFile", file);
    formData.append("fileName", fileName);
    try {
      const response = await service.uploadFile(formData);
      console.log("response", response);
      setUploadResponse(response);
    } catch (error) {
      // The error is displayed as a toast by the service.
      // We just need to catch the rejection to prevent an uncaught promise error.
      setUploadInProgress(false);
    }
  };

  return (
    <>
      <span></span>
      <input
        type="file"
        onChange={saveFile}
        key={fileInputWorkaroundKey}
        disabled={uploadInProgress}
      />
      <button disabled={!file || uploadInProgress} onClick={uploadFile}>
        Upload File
      </button>
      <br />
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span>
          Status:
          {uploadInProgress ? "Dodaje plik - czekaj" : " Nic nie robię"}
        </span>
        {uploadInProgress && <img src="turtle.gif" className="turtle" alt="turtle" width="60" />}
        {uploadInProgress && <span>{elapsedTime}s</span>}
      </div>
      <br />
      <span>{uploadResponseText}</span>
      <hr></hr>
    </>
  );
}

export default FileUpload;
