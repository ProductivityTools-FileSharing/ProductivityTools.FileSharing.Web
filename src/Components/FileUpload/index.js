import axios from "axios";
import { useState } from "react"
import service from '../../Services/api'


function FileUpload() {

    const [file, setFile] = useState();
    const [fileName, setFileName] = useState();
    const [uploadInProgress, setUploadInProgress] = useState(false);
    const [uploadResponse, setUploadResponse] = useState('');


    const saveFile = (e) => {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
    }

    const uploadFile = async (e) => {
        setUploadInProgress(true);
        setUploadResponse('');
        const formData = new FormData();
        formData.append("formFile", file);
        formData.append("fileName", fileName);
        const response = await service.uploadFile(formData);
        setUploadInProgress(false);
        console.log("response",response);
        setUploadResponse(response.data);
    }

    return (
        <>
        <span>x</span>
             <input type="file" onChange={saveFile} />
            <button onClick={uploadFile}>Upload File</button><br/>
            <span>Upload in progress: {uploadInProgress ? 'true' : 'false'}</span><br/>
            <span>Upload respone: {uploadResponse}</span>
        </>
    )
}

export default FileUpload;