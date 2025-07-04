import { logout } from "./firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function Context() {
  let navigate = useNavigate();
  let auth = useAuth();
  console.log(auth);
  const buttonLogout = (e) => {
    logout();
    console.log("Logged out");
    navigate("/Login");
  };

  return (
    <>
      <span>User logged: </span><span>{auth?.user?.displayName}</span>
      <button onClick={buttonLogout}>logout</button>
        
      <hr></hr>
    </>
  );
}

export default Context;
