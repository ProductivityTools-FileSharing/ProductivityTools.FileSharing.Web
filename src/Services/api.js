import axios from "axios";
import { config } from "../Config";
import { auth } from "../Session/firebase";
import { toast } from "react-toastify";

async function callAuthorizedEndpointWithToast(
  call,
  pendingMessage,
  successMessage
) {
  return toast.promise(callAuthorizedEndpoint(call), {
    pending: pendingMessage ? pendingMessage : "Missing pending message",
    success: successMessage ? successMessage : "Missing sucesss message",
    error: "something happned!!!!",
  });
}

async function callAuthorizedEndpoint(call) {
  console.log("auth", auth);
  console.log("current user", auth.currentUser);
  if (auth && auth.currentUser && auth.currentUser.accessToken) {
    const header = {
      headers: { Authorization: `Bearer ${auth.currentUser.accessToken}` },
    };
    try {
      const result = await call(header);
      return result;
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("User not authenticated");
  }
}

async function getFiles() {
  let call = async (header) => {
    console.log("env", process.env.NODE_ENV);
    let filesUrl = `${config.serverUrl}/File`;
    console.log("filesurl", filesUrl);
    const response = await axios.get(filesUrl, header);
    return response.data;
  };
  return callAuthorizedEndpointWithToast(
    call,
    "Getting list of files",
    "List of files retrieved"
  );
}

async function uploadFile(formData) {
  let call = async (header) => {
    const res = await axios.post(`${config.serverUrl}/File`, formData, header);
    console.log(res);
    return res;
  };
  return callAuthorizedEndpointWithToast(
    call,
    "Uplading file",
    "File uploaded"
  );
}

async function deleteFile(fileName) {
  let call = async (header) => {
    let headers = header.headers;
    const res = await axios.delete(`${config.serverUrl}/File`, {
      headers: headers,
      data: {
        fileName: fileName,
      },
    });
    console.log(res);
    return res;
  };
  return callAuthorizedEndpointWithToast(call, "Removing file", "File removed");
}

const service = {
  getFiles,
  uploadFile,
  deleteFile,
};

export default service;
