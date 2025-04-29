
const dev = {
    serverUrl : 'http://localhost:5084'
}


const prod = {
    serverUrl : 'http://localhost:5084'
}

export const config = process.env.NODE_ENV === 'development' ? dev : prod;