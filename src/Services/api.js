import axios from "axios";
import { config } from "../Config";

async function getFiles() {
  console.log("env", process.env.NODE_ENV);
  let filesUrl = `${config.serverUrl}/File`;
  console.log("filesurl", filesUrl);
  const response = await axios.get(filesUrl);
  return response.data;
}

async function uploadFile(formData) {
  const res = await axios.post(`${config.serverUrl}/File`, formData);
  console.log(res);
  return res;
}

async function deleteFile(fileName) {
  const res = await axios.delete(`${config.serverUrl}/File`, {
    headers: {},
    data: {
      fileName: fileName,
    },
  });
  console.log(res);
  return res;
}

const service = {
  getFiles,
  uploadFile,
  deleteFile,
};

export default service;
