// src/pages/upload/Uploadimage.js

import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from "./uploadimage.module.scss";
import Card from "../../components/card/Card";

const Uploadimage = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success("File uploaded successfully");
    } catch (error) {
      toast.error("Error uploading file");
    }
  };

  return (
    <div className={`container ${styles.upload}`}>
      <Card>
        <div className={styles.form}>
          <h2>Upload an Image</h2>
          <form onSubmit={handleUpload}>
            <input type="file" onChange={handleFileChange} />
            <button type="submit" className={styles.uploadButton}>Upload</button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Uploadimage;
