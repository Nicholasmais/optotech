import React from 'react';
const api = require('../services/api'); 

const DownloadButton = () => {
  const handleDownload = async () => {
    api.downloadFile().then((res) => {      
      const url = window.URL.createObjectURL(new Blob([res.data]), {type:res.headers.get("content-type")});
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', res.headers.get("content-disposition").split("=")[1]);
      document.body.appendChild(link);
      link.click();
      link.remove();
    });    
  };

  return (
    <button onClick={handleDownload}>
      Baixar arquivo de calibração
    </button>
  );
};

export default DownloadButton;
