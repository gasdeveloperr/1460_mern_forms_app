import React, { useEffect, useState } from 'react';
import './DocumentPage.css'
import folder_icon from '../icons/folder-icon.svg'
import open_folder_icon from '../icons/folder-open-icon.svg'
import add_folder_icon from '../icons/add-folder-icon.svg'
import file_icon from '../icons/file-icon.svg'
import updload_icon from '../icons/upload-icon.svg'
import file_export from '../icons/file-export-icon.svg'
import pdf_icon from '../icons/file-pdf-icon.svg'
import docx_icon from '../icons/docx-file-icon.svg'
import image_icon from '../icons/image-file-icon.svg'
import { getAuthToken, getUserId } from '../utils';
import { backend_point } from '../consts';
import axios from 'axios';
import DocxViewerComponent from './DocxViewerComponent';
import AddFolderWindow from './AddFolderWindow';


const DocumentsManagement = ({files, updateUserData, setIsLoading}) => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [previewOption, setPreviewOption] = useState('content');
  
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)

  const [selectedFile, setSelectedFile] = useState(null);


  const [currentPath, setCurrentPath] = useState([]);

  const [organizedFiles, setOrganizedFiles] = useState({})

  const organizeFilesByFolder = (files) => {
    const result = {};
  
    files.forEach((file) => {
      if(file){
        // Extract folder path from the file URL
        const urlParts = new URL(file.fileUrl);
        const folderPath = urlParts.pathname.split('/').slice(1, -1).join('/');

    
        // If no folder, use root as default
        const folder = folderPath || 'General';
    
        // Initialize folder array if not already present
        if (!result[folder]) {
          result[folder] = {folderLevel: '', files:[]};
        }
    
        // Push the file data into the respective folder
        result[folder].files.push({
          fileName: file.fileName,
          fileUrl: file.fileUrl,
          fileType: file.fileType,
          fileSize: file.fileSize,
        });
      }
    });
  
    return result;

      // const test ='/Network%20Assessment/sub_Network%20Assessment/1734691511032-Section%20Form-16.pdf'
      
      
      // const testPath = test.split('/').slice(1, -1).join('/');
      // const testArray = testPath.split('/')
      // console.log('testArray', testArray)
      
      // testArray.map((folder, folderIndex) => {
      //   result[folder] = {folderLevel: '', files:[]}
      // })
  };
  

  useEffect(() => {
    //console.log(organizeFilesByFolder(files))
    setOrganizedFiles(organizeFilesByFolder(files))
  },[files])

  const [fileType, setFileType] = useState("");

  const userId = getUserId()
  
  const uploadFileToAWS = async (file) => {
    if (!file) return null;
  
    const fileData = new FormData();
    fileData.append('document', file);
    if(currentPath.category !== 'General'){
      fileData.append('folderName', currentPath.category || currentPath.subcategory || '');
    }
    
    try {
      const response = await axios.post(`${backend_point}/api/awsFiles/upload`, fileData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.fileData;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };
    
  const uploadFile = async (file) => {
    setIsLoading(true);
    
    let fileData = null;
    if (file) {
      fileData = await uploadFileToAWS(file);
      if (!fileData) {
        setIsLoading(false);
        return;
      }
    }
    console.log('file data: ', fileData)
    const token = getAuthToken();
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };
  
    try {
      await axios.post(`${backend_point}/api/users/fileUpload/${userId}`, {fileData: fileData}, config);
  
      updateUserData()
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      console.log('file to upload: ', file)
      uploadFile(file);
    }
  };

  const [openFolders, setOpenFolders] = useState({});

  const handleDocumentClick = (document) => {
    const urlParts = new URL(document.fileUrl);
    const folderPath = urlParts.pathname.split('/').slice(1, -1).join('/');
    console.log('currentPath: ',folderPath)
    // setCurrentPath((prevPath) => [...prevPath.slice(0, -1), document.fileName]);
    setSelectedDocument(document);
    const fileExtension = document.fileName.split(".").pop().toLowerCase();
    setFileType(fileExtension);
  };

  const handleFolderClick = (folderName) => {
    if(!selectedDocument){
      console.log('currentPath: ',currentPath)
      const isFolderOpen = openFolders[folderName];
      if(isFolderOpen && currentPath.includes(decodeURIComponent(folderName))){

      }else{

      }
      setCurrentPath((prevPath) => [...prevPath, decodeURIComponent(folderName)]);
    }
    toggleFolder(folderName);
  };
  
  const handleSubfolderClick = (parentFolder, subfolder) => {
    const fullPath = `${parentFolder}/${subfolder}`;
    setOpenFolders((prevState) => ({
      ...prevState,
      [fullPath]: !prevState[fullPath],
    }));
  
    setCurrentPath((prevPath) => {
      if (prevPath.includes(fullPath)) {
        return prevPath.slice(0, prevPath.indexOf(fullPath));
      } else {
        return [...prevPath, fullPath];
      }
    });
  };
  
  const toggleFolder = (folder) => {
    setOpenFolders((prevState) => ({
      ...prevState,
      [folder]: !prevState[folder],
    }));
  };
  

  const getFileIcon = (fileName) => {
    if (fileName.endsWith('.pdf')) {
      return pdf_icon;
    } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
      return docx_icon;
    } 
    else if (/\.(jpg|jpeg|png|gif|bmp)$/i.test(fileName)) {
      return image_icon;
    } else {
      return ''; // Fallback icon
    }
  };

  return (
    <div className="document-management">
      <AddFolderWindow isOpen={isCreatingFolder} onClose={() => setIsCreatingFolder(false)} 
        currentPath={currentPath}/>
      <div className="breadcrumb">
        <div>
          <span onClick={() => setCurrentPath([])}>Home</span>
          {/* {currentPath?.map((part, index) => (
            <span 
              key={index} 
              onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}
            >
              &gt; {part}
            </span>
          ))} */}
        </div>
        
          <div className='document-management-options'>
            <input
            type="file"
            accept="application/pdf, image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="file-input"
            />
            {/* <div className='document-management-option' onClick={() => setIsCreatingFolder(true)}>
              <img src={add_folder_icon} className='size22-icon' alt="add folder" />
            </div> */}
            <div className='document-management-option' onClick={() => document.getElementById('file-input').click()}>
              <img src={updload_icon} className='size24-icon' alt="upload file" />
            </div>
          </div>
      </div>
      <div className="document-management-content">
        <div className="sidebar">
          <ul className="file-sublist">
            {organizedFiles &&
            Object.entries(organizedFiles).map(([folder, folderFiles]) => (
              <li key={folder} className="folder-item">
                <div className="folder-title" onClick={() => handleFolderClick(folder)}>
                  <img src={openFolders[folder] ? open_folder_icon : folder_icon} className='folder-icon' alt="folder icon" />
                  {decodeURIComponent(folder)}
                </div>
                {openFolders[folder] && (
                  <ul className="file-sublist">
                    {folderFiles.files.length !== 0 && folderFiles.files.map((file, fileIndex) => (
                      <li
                        className="file-title"
                        key={fileIndex}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDocumentClick(file, decodeURIComponent(folder));
                        }}
                      >
                        <img
                          src={file_icon} // Replace with your file icon
                          className="size20-icon"
                          alt="file icon"
                        />
                        <div 
                        className={'file-title-text'+(selectedDocument?.fileUrl===file.fileUrl ? '-chosen' :'')}>
                          {file.fileName}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="document-viewer">
          {
          selectedDocument  ? (
          <div className="document-preview">
            <h3 className="document-preview-title"> 
              <img src={getFileIcon(selectedDocument.fileName)} className='size24-icon' alt="doc" />
              {selectedDocument.fileName}
            </h3>
            <div className="document-preview-body">
              <div className="document-preview-options">
                <div className={`document-preview-option${previewOption==='content' ? '-chosen': ''}`}
                  onClick={() => setPreviewOption('content')}>
                  Document Preview
                </div>
                <div className={`document-preview-option${previewOption==='info' ? '-chosen' : ''}`}
                  onClick={() => setPreviewOption('info')}>
                  Document Info
                </div>
              </div>
                <div className="document-preview-content">
                {previewOption === 'content' ? (
                  fileType === 'docx' ? (
                    <DocxViewerComponent fileUrl={selectedDocument?.fileUrl} />
                  ) : (
                    <div>
                      <iframe src={selectedDocument?.fileUrl} width='100%' height='1200px' />
                    </div>
                  )
                ) : (
                  <div className="document-preview-info">
                    Document content info for {selectedDocument?.fileName} goes here.
                  </div>
                )}
                </div>
              </div>
            </div> 
            ) : (
              <p style={{padding: '8px 12px'}}>Select a document to view its content.</p>
            )
          }
        </div>
      </div>
      
    </div>
  );
};

export default DocumentsManagement;


 {/* <ul>
            {documents.map((category, categoryIndex) => (
              <li key={category.category} onClick={() => handleCategoryClick(categoryIndex)}>
                <div className='folder-title'>
                  <img src={category.isOpen ? open_folder_icon : folder_icon} className='folder-icon' alt="folder icon" />
                  {category.category}
                </div>
                {
                  category.isOpen && (
                    <ul>
                      {category.subcategories.map((subcategory, subcategoryIndex) => (
                        <li key={subcategory.name} 
                        onClick={(e) => { e.stopPropagation(); handleSubcategoryClick(categoryIndex, subcategoryIndex); }}>
                          <div className='folder-title'>
                            <img src={subcategory.isOpen ? open_folder_icon : folder_icon} className='folder-icon' alt="folder icon" />
                            {subcategory.name}
                          </div>
                          {subcategory.isOpen && (
                            <ul>
                              {subcategory.files.map((file) => (
                                <li className='file-title' key={file} onClick={(e) => { e.stopPropagation(); handleDocumentClick(file); }}>
                                  <img src={file_icon} className='size20-icon' alt="file icon" />
                                  <span>{file}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  )
                }
              </li>
            ))}
          </ul> */}