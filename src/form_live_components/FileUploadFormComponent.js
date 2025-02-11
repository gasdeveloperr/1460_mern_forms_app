import { useState } from 'react';
import file_upload_icon from '../icons/file-upload-icon.svg'
import file_icon from '../icons/file-icon.svg'

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
        {
          fileName ?
          <div className='form-live-component-container-label'>
            <img className='size24-icon' src={file_icon}/> 
            {fileName}
          </div>
          :
          field.title ?
          <div className='form-live-component-container-label'>
            {field.required && <span>*</span>}
            {field.title}
          </div>
          :
          <div className='form-live-component-container-label'>
            <img className='size24-icon' src={file_upload_icon}/>
          </div>
        }
        {message && <p>{message}</p>}
      </label>
    </div>
  );
};

export default FileUploadFormComponent;
