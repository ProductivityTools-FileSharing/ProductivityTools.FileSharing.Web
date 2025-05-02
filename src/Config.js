
const dev = {
    serverUrl : 'http://localhost:5084'
}


const prod = {
    serverUrl : 'http://kameralne.productivitytools.top:8005'
}
export const config = process.env.NODE_ENV === 'development' ? prod : prod;
//export const config = process.env.NODE_ENV === 'development' ? dev : prod;