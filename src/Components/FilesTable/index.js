import React, { useState, useEffect } from 'react';
import service from '../../Services/api'



function FilesTable() {

  const [files, setFiles] = useState([]);


  useEffect(() => {
    const fetchAddressList = async () => {
    
        const response = await service.getFiles();
        console.log(response);
        setFiles(response);
    };

    fetchAddressList();

  }, []);


 
  return (
    <div className="address-table-container"> {/* Optional wrapper */}
      <h2>Service Status Dashboard</h2>

      <table class="blueTable">
        <thead>
          <tr>
            <th>Name</th>
           
          </tr>
        </thead>
        <tbody>
            <tr><td>example</td></tr>
          {files && files.map((file, index) => (
           <tr><td>https://filesharinggs.blob.core.windows.net/filecontainergs/{file}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FilesTable;
