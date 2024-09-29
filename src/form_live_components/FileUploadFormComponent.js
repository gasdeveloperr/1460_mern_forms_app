import { useState } from 'react';

const FileUploadFormComponent = ({field, onFileChange }) => {
  const [message, setMessage] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFileName(selectedFile.name); // Set the file name to display
      onFileChange(selectedFile); // Pass the selected file to the parent
    }
  };

  return (
    <div>
      <label htmlFor={field.id} className="form-live-component-container">
        <input
          type="file"
          id={field.id}
          name={field.title}
          className="file-input"
          required={field.required}
          disabled={field.read_only}
          onChange={handleFileChange}
          hidden
        />
        <label htmlFor={field.id} className="form-file-label">
          {field.required && <span>*</span>}
          {field.title}
        </label>
        {fileName && <p>Selected file: {fileName}</p>}
        {message && <p>{message}</p>}
      </label>
    </div>
  );
};

export default FileUploadFormComponent;
