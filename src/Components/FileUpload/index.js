import axios from "axios";
import { useEffect, useState } from "react";
import service from "../../Services/api";

function FileUpload({ onUploadSuccess }) {
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState();
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const [uploadResponse, setUploadResponse] = useState();
  const [uploadResponseText, setUploadResponseText] = useState("");
  const [fileInputWorkaroundKey, setFileInputWorkaroundKey] = useState(
    Date.now()
  );

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
    const response = await service.uploadFile(formData);
    console.log("response", response);
    setUploadResponse(response);
  };

  return (
    <>
      <span></span>
      <input type="file" onChange={saveFile} key={fileInputWorkaroundKey} />
      <button disabled={!file} onClick={uploadFile}>
        Upload File
      </button>
      <br />
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span>
          Status:
          {uploadInProgress ? "Dodaje plik - czekaj" : " Nic nie robię"}
        </span>
        {uploadInProgress &&  <img src="turtle.gif" className="turtle" alt="turtle" width="60" />}
      </div>
      <br />
      <span>{uploadResponseText}</span>
      <hr></hr>
    </>
  );
}

export default FileUpload;
