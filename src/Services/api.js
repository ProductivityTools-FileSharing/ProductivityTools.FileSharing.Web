import axios from 'axios'
import { config } from '../Config';




async function getFiles() {
    let filesUrl=`{config.serverUrl}/File`
    const response = await axios.get(filesUrl)
    return response.data;
}



const service={
    getFiles,
}  


export default service;