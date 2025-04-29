import axios from 'axios'
import { config } from '../Config';




async function getFiles() {
    let filesUrl=`${config.serverUrl}/File`
    const response = await axios.get(filesUrl)
    return response.data;
}

async function uploadFile(formData){
    const res=await axios.post(`${config.serverUrl}/File`,formData);
    console.log(res);

}


const service={
    getFiles,
    uploadFile
}  


export default service;