import React, { useState, useEffect } from 'react';
import service from '../../Services/api'



function FilesTable() {

  const [files, setFiles] = useState([]);


  useEffect(() => {
    const fetchAddressList = async () => {
    
        const response = await service.getFiles();
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
            <th>Service</th>
            <th>
              Category
            </th>
            <th>
              Service
            </th>
            <th>
              SQLInstanceName
            </th>
            <th>
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {files && files.map((file, index) => (
           <tr><td>{file.name}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FilesTable;
