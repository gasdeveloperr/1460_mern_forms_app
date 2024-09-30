import React, { useState } from 'react';
import './DocumentPage.css'
import folder_icon from '../icons/folder-icon.svg'
import open_folder_icon from '../icons/folder-open-icon.svg'
import file_icon from '../icons/file-icon.svg'
import updload_icon from '../icons/upload-icon.svg'
import file_export from '../icons/file-export-icon.svg'
import pdf_icon from '../icons/file-pdf-icon.svg'
import { Document, Page } from 'react-pdf';
import { getAuthToken, getUserId } from '../utils';
import { backend_point } from '../consts';
import axios from 'axios';


const DocumentsManagement = ({files, updateUserData, setIsLoading}) => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [previewOption, setPreviewOption] = useState('content');

  const [selectedFile, setSelectedFile] = useState(null);

  const [documents, setDocuments] = useState([
    {
      category: "Policy & Procedure",
      isOpen: true,
      subcategories: [
        {
          name: "Employee Manual",
          isOpen: false,
          files: [
            "Employee Handbook.pdf",
            "Code of Conduct.pdf",
            "Dress Code Policy.pdf"
          ]
        },
        {
          name: "OSHA",
          isOpen: true,
          files: [
            "2022 Smiles for Centreville OSHA Manual.pdf",
            "Workplace Safety Guidelines.pdf",
            "Emergency Procedures.pdf"
          ]
        }
      ]
    },
    {
      category: "HR Policies",
      isOpen: false,
      subcategories: [
        {
          name: "Labor Posters",
          isOpen: false,
          files: [
            "Federal Labor Law Poster.pdf",
            "State Labor Law Poster.pdf",
            "Employee Rights Notice.pdf"
          ]
        },
        {
          name: "Hiring Procedures",
          isOpen: false,
          files: [
            "Interview Guidelines.pdf",
            "Onboarding Checklist.pdf",
            "Job Descriptions.pdf"
          ]
        }
      ]
    }
  ]);

  const handleCategoryClick = (index) => {
    const updatedDocuments = documents.map((category, i) => {
      if (i === index) {
        return { ...category, isOpen: !category.isOpen };
      }
      return category;
    });

    setDocuments(updatedDocuments);
    setSelectedCategory(updatedDocuments[index]);
    setSelectedSubcategory(null);
    setSelectedDocument(null); // Reset document selection when a new category is chosen
  };

  const handleSubcategoryClick = (categoryIndex, subcategoryIndex) => {
    const updatedDocuments = documents.map((category, i) => {
      if (i === categoryIndex) {
        const updatedSubcategories = category.subcategories.map((subcategory, j) => {
          if (j === subcategoryIndex) {
            return { ...subcategory, isOpen: !subcategory.isOpen };
          }
          return subcategory;
        });
        return { ...category, subcategories: updatedSubcategories };
      }
      return category;
    });

    setDocuments(updatedDocuments);
    setSelectedSubcategory(updatedDocuments[categoryIndex].subcategories[subcategoryIndex]);
    setSelectedDocument(null); // Reset document selection when a new subcategory is chosen
  };

  const handleDocumentClick = (document) => {
    setSelectedDocument(document);
  };

  const userId = getUserId()
  
  const uploadFileToAWS = async (file) => {
    if (!file) return null;
  
    const fileData = new FormData();
    fileData.append('document', file);
    
    try {
      const response = await axios.post(`${backend_point}/upload`, fileData, {
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

  return (
    <div className="document-management">
      <div className="breadcrumb">
        <div>
          <span>Home</span>
          {selectedCategory && <span> &gt; {selectedCategory.category}</span>}
          {selectedSubcategory && <span> &gt; {selectedSubcategory.name}</span>}
          {selectedDocument && <span> &gt; {selectedDocument.fileName}</span>}
        </div>
        
          <>
            <input
            type="file"
            accept="application/pdf, image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="file-input"
            />
            <div style={{cursor:'pointer'}} onClick={() => document.getElementById('file-input').click()}>
              <img src={updload_icon} className='size24-icon' alt="upload icon" />
            </div>
          </>
      </div>
      <div className="document-management-content">
        <div className="sidebar">

        {files && 
        files.map((file, fileIndex) => (
          <li className='file-title' key={fileIndex} onClick={(e) => { e.stopPropagation(); handleDocumentClick(file); }}>
            <img src={file_icon} className='size20-icon' alt="file icon" />
            <span>{file.fileName}</span>
          </li>)
        )}
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
        </div>

        <div className="document-viewer">
          {
          selectedDocument  ? (
          <div className="document-preview">
            <h3 className="document-preview-title"> 
              <img src={pdf_icon} className='size24-icon' alt="pdf icon" />
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
                  {
                    previewOption === 'content' ?           
                    <div>
                      <iframe src={selectedDocument.fileUrl} width='1000px' height='1200px' />
                    </div>
                    // <Document
                    //   file={`path/to/your/documents/${selectedDocument}`}
                    //   onLoadSuccess={onDocumentLoadSuccess}
                    // >
                    //   {Array.from(
                    //     new Array(numPages),
                    //     (el, index) => (
                    //       <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                    //     )
                    //   )}
                    // </Document>
                    :
                    <div className="document-preview-info">
                      Document content info for {selectedDocument.fileName} goes here.
                    </div>
                  }
                </div>
              </div>
            </div> 
            ) : (
              <p>Select a document to view its content.</p>
            )
          }
        </div>
      </div>
      
    </div>
  );
};

export default DocumentsManagement;
