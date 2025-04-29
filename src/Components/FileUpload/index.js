import axios from "axios";
import { useState } from "react"
import service from '../../Services/api'


function FileUpload() {

    const [file, setFile] = useState();
    const [fileName, setFileName] = useState();

    const saveFile = (e) => {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
    }

    const uploadFile = async (e) => {
        const formData = new FormData();
        formData.append("formFile", file);
        formData.append("fileName", fileName);
        const response = await service.uploadFile(formData);
    }

    return (
        <>
        <span>x</span>
             <input type="file" onChange={saveFile} />
            <button onClick={uploadFile}>Upload File</button>
        </>
    )
}

export default FileUpload;