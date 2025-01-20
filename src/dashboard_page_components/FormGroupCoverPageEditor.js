import React, { useCallback, useState } from 'react';
import cover_page_image from '../icons/cover-page-image.jpg';

const EditMode = ({document, handleChange}) => (
  <div className="edit-container">
    <div className="form-group">
      <label className="form-label">Cover Page Title</label>
      <input
        name="title"
        value={document.title}
        onChange={(e) => handleChange(e, "title")}
        placeholder="HIPAA Security Risk Assessment"
        className="form-input"
      />
    </div>
    <div className="form-group">
      <label className="form-label">Prepared For</label>
      <input
        name="preparedFor"
        value={document.preparedFor}
        onChange={(e) => handleChange(e, "preparedFor")}
        placeholder="Client Name"
        className="form-input"
      />
    </div>
    <div className="form-group">
      <label className="form-label">Prepared By</label>
      <input
        name="preparedBy"
        value={document.preparedBy}
        onChange={(e) => handleChange(e, "preparedBy")}
        placeholder="Company Name"
        className="form-input"
      />
    </div>
    <div className="form-group">
      <label className="form-label">Date</label>
      <input
        type="date"
        name="date"
        value={document.date}
        onChange={(e) => handleChange(e, "date")}
        className="form-input"
      />
    </div>
    <div className="form-group">
      <label className="form-label">Confidentiality Note</label>
      <textarea
        name="confidentialityNote"
        value={document.confidentialityNote}
        onChange={(e) => handleChange(e, "confidentialityNote")}
        rows={4}
        className="form-textarea"
        placeholder="Enter confidentiality notice..."
      />
    </div>
  </div>
);

const FormGroupCoverPageEditor = ({formGroupCoverPage, updateFormGroup}) => {
  const [document, setDocument] = useState({
    title: formGroupCoverPage.title || '',
    preparedFor: formGroupCoverPage.preparedFor || '',
    preparedBy: formGroupCoverPage.preparedBy || '',
    date: formGroupCoverPage.date || new Date().toISOString().split('T')[0],
    confidentialityNote: formGroupCoverPage.confidentialityNote || ''
  });
  const [isPreview, setIsPreview] = useState(false);

  const handleChange = useCallback((e, key) => {
    const { value } = e.target;
    setDocument(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const PreviewMode = () => (
    <div className="cover-page-preview-container">
      {/* <div className="header-gradient"> */}
        <div className="header-content">
        <img className='preview-cover-page-image' src={cover_page_image}/>
          {/* <div className="header-icon">
            <div className="icon-circle">
              <div className="icon" />
            </div>
          </div> */}
        </div>
      {/* </div> */}
      <div className="cover-page-content">
        <h1 className="document-title">{document.title || 'Document Title'}</h1>
        
        <div className="info-section">
          <div>
            <p className="info-label">Prepared for:</p>
            <p className="info-value highlight">{document.preparedFor || '[Client Name]'}</p>
          </div>
          
          <div>
            <p className="info-label">Prepared by:</p>
            <p className="info-value highlight">{document.preparedBy || '[Company Name]'}</p>
          </div>
          
          <div>
            <p className="info-label">on</p>
            <p className="info-value highlight">
              {new Date(document.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
        
        <div className="confidentiality-notice">
          <p> 
            <span className="confidentiality-title">CONFIDENTIALITY NOTE: </span> 
            {document.confidentialityNote || 'The information contained in this report/document is for the exclusive use of the client.'}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="form-group-cover-page-edit">
      <div className="header-section">
        <h1 className="header-title">Cover Page Editor</h1>
        <div className="button-group">
          <button 
            className='modal-button' type="usual"
            onClick={() => setIsPreview(!isPreview)}
          >
            {isPreview ? (
              <>
                <div className="button-icon" />
                Edit Mode
              </>
            ) : (
              <>
                <div className="button-icon" />
                Preview
              </>
            )}
          </button>
          
          <button className='modal-button' type="submit" onClick={() => updateFormGroup(document)}>
            Save Cover page
          </button>
        </div>
      </div>
      {isPreview ? <PreviewMode /> : <EditMode document={document} handleChange={handleChange}/>}
    </div>
  );
};

export default FormGroupCoverPageEditor;