import { initializeApp } from "firebase/app";

// import * as apiService from "services/apiService";



import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signOut,
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyABGUj0Pb2GO7VYIysnhmFz6qIjvsdnC54",
    authDomain: "pttransfersprod.firebaseapp.com",
    projectId: "pttransfersprod",
    storageBucket: "pttransfersprod.appspot.com",
    messagingSenderId: "221427138618",
    appId: "1:221427138618:web:aef09ff2bed52722f33503"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const isJwtExpired = require('jwt-check-expiration');

const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        console.log("token");
        console.log(res);
        console.log(await res.user.getIdToken());
        localStorage.setItem("token",await res.user.getIdToken());     
        
        const user = auth.currentUser;
       // const token=await user.getIdToken(true);

        return res.user;
    } catch (err) {
        console.error(err);
        alert(err);
    }
};

const logout = () => {
    signOut(auth);
    console.log("singOut performed")
    localStorage.removeItem("token")
};

const getToken = () => {
    let token = localStorage.getItem('token');
    return token;
}

const tokenExpired = () => {
    let token = localStorage.getItem('token');
    if (token) {
        let result = isJwtExpired(token)
        return result;
    }
    else {
        return true;
    }
}

export {
    auth,
    signInWithGoogle,
    logout,
    getToken,
    tokenExpired
};