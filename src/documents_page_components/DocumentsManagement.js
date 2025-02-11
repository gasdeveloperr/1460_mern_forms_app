import React, { useEffect, useState } from 'react';
import './DocumentPage.css'
import folder_icon from '../icons/folder-icon.svg'
import open_folder_icon from '../icons/folder-open-icon.svg'
import add_folder_icon from '../icons/add-folder-icon-new.svg'
import file_icon from '../icons/file-icon.svg'
import add_file_icon from '../icons/add-file-icon-new.svg'
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

const FolderContents = ({ item, openFolders, handleFolderClick, handleDocumentClick, selectedDocument, 
  level = 0 }) => {
  if (item.type === 'file') {
    return (
      <li className="file-title"
        onClick={(e) => {
          e.stopPropagation();
          handleDocumentClick(item, item.path);
        }}
      >
        <img src={file_icon} className="size20-icon" alt="file icon" />
        <div 
          className={'file-title-text' + (selectedDocument?.fileUrl === item.fileUrl ? '-chosen' : '')}
        >
          {item.name}
        </div>
      </li>
    );
  }

  return (
    <li className="folder-item">
      <div className="folder-title" onClick={() => handleFolderClick(item.path)}>
        <img src={openFolders[item.path] ? open_folder_icon : folder_icon} 
          className='folder-icon' 
          alt="folder icon" 
        />
        {decodeURIComponent(item.name)}
      </div>
      {openFolders[item.path] && (
        <ul className="file-sublist">
          {item.children.map((child, index) => (
            <FolderContents
              key={`${child.path}-${index}`}
              item={child}
              openFolders={openFolders}
              handleFolderClick={handleFolderClick}
              handleDocumentClick={handleDocumentClick}
              selectedDocument={selectedDocument}
              level={level + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const DocumentsManagement = ({files, updateUserData, setIsLoading, setNewFolderAdded}) => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [previewOption, setPreviewOption] = useState('content');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)

  const [selectedFile, setSelectedFile] = useState(null);

  const [currentPath, setCurrentPath] = useState([]);
  const [organizedFiles, setOrganizedFiles] = useState({})

  const organizeFilesByFolder = (files) => {
    const root = {
      name: 'Root',
      type: 'folder',
      children: [],
      path: ''
    };
  
    files.forEach((file) => {
      if (file && file.fileUrl) {
        // Extract folder path from the file URL
        const urlParts = new URL(file.fileUrl);
        const pathParts = urlParts.pathname.split('/').slice(1, -1);
        const fileName = urlParts.pathname.split('/').pop();
  
        let currentLevel = root;
        let currentPath = '';
  
        pathParts.forEach((folderName) => {
          currentPath = currentPath ? `${currentPath}/${folderName}` : folderName;
          // Find or create folder at current level
          let folder = currentLevel.children.find(
            item => item.type === 'folder' && item.name === folderName
          );
  
          if (!folder) {
            folder = {
              name: folderName,
              type: 'folder',
              children: [],
              path: currentPath
            };
            currentLevel.children.push(folder);
          }
          currentLevel = folder;
        });
        if(file.fileType !== 'folder'){
          // Add file to the deepest level
          currentLevel.children.push({
            name: file.fileName || fileName,
            type: 'file',
            fileUrl: file.fileUrl,
            fileType: file.fileType,
            fileSize: file.fileSize,
            path: currentPath ? `${currentPath}/${fileName}` : fileName
          });
        }
      }
    });
  
    // Helper function to sort folders and files
    const sortItems = (items) => {
      return items.sort((a, b) => {
        // Folders come before files
        if (a.type !== b.type) {
          return a.type === 'folder' ? -1 : 1;
        }
        // Alphabetical sort within same type
        return a.name.localeCompare(b.name);
      });
    };
  
    // Recursively sort all levels
    const sortRecursively = (node) => {
      if (node.children) {
        node.children = sortItems(node.children);
        node.children.forEach(child => {
          if (child.type === 'folder') {
            sortRecursively(child);
          }
        });
      }
      return node;
    };
    return sortRecursively(root);
  };
  useEffect(() => {
    setOrganizedFiles(organizeFilesByFolder(files))
  },[files])

  const [fileType, setFileType] = useState("");
  const userId = getUserId()
  
  const uploadFileToAWS = async (file) => {
    if (!file) return null;
  
    const fileData = new FormData();
    fileData.append('document', file);
    fileData.append('currentPath', JSON.stringify(currentPath) || '');
    
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
    // Extract path using the new path property
    const pathArray = document.path.split('/').filter(Boolean);
    //console.log('currentPath: ', currentPath);
    setCurrentPath(pathArray);
    setSelectedDocument(document);
    const fileExtension = document.name.split('.').pop().toLowerCase();
    setFileType(fileExtension);
  };
  
  const handleFolderClick = (folderPath) => {
    if (!selectedDocument) {
      //console.log('currentPath: ', currentPath);
      const isFolderOpen = openFolders[folderPath];
      const pathArray = folderPath.split('/').filter(Boolean);
      
      if (isFolderOpen && currentPath.join('/') === folderPath) {
        // If closing current folder, move up one level
        setCurrentPath(pathArray.slice(0, -1));
      } else {
        // If opening folder, set it as current path
        setCurrentPath(pathArray);
      }
    }
    
    // Toggle folder open/closed state
    setOpenFolders(prev => ({
      ...prev,
      [folderPath]: !prev[folderPath]
    }));
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
        currentPath={currentPath} setNewFolderAdded={setNewFolderAdded}/>
      <div className="breadcrumb">
        <div>
          <span onClick={() => setCurrentPath([])}>Home</span>
          {currentPath?.map((part, index) => (
            <span 
              key={index} 
              onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}
            >
              &nbsp;&gt; {decodeURIComponent(part)} 
            </span>
          ))}
        </div>
        
          <div className='document-management-options'>
            <input
            type="file"
            accept="application/pdf, image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="file-input"
            />
            <div className='document-management-option' onClick={() => setIsCreatingFolder(true)}>
              <img src={add_folder_icon} className='size28-icon' alt="add folder" />
            </div>
            <div className='document-management-option' onClick={() => document.getElementById('file-input').click()}>
              <img src={add_file_icon} className='size24-icon' alt="add file" />
            </div>
          </div>
      </div>
      <div className="document-management-content">
        <div className="sidebar">
          <ul className="file-sublist">
            {organizedFiles.children?.map((item, index) => (
              <FolderContents
                key={`${item.path}-${index}`}
                item={item}
                openFolders={openFolders}
                handleFolderClick={handleFolderClick}
                handleDocumentClick={handleDocumentClick}
                selectedDocument={selectedDocument}
              />
            ))}
          </ul>
        </div>
        {/* <div className="sidebar">
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
        </div> */}
        <div className="document-viewer">
          {
          selectedDocument  ? (
          <div className="document-preview">
            <h3 className="document-preview-title"> 
              <img src={getFileIcon(selectedDocument.name)} className='size24-icon' alt="doc" />
              {selectedDocument.name}
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