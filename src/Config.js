
const dev = {
    serverUrl : 'http://localhost:5084',
    fileUrl: 'https://filesharinggs.blob.core.windows.net/filecontainergs'
}


const prod = {
    serverUrl : 'https://file.productivitytools.top:8005',
    fileUrl: 'https://filesharinggs.blob.core.windows.net/filecontainergs'
}
export const config = process.env.NODE_ENV === 'development' ? prod : prod;
//export const config = process.env.NODE_ENV === 'development' ? dev : prod;