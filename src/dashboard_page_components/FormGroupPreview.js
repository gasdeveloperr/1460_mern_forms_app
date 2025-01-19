import React, { useCallback, useState } from 'react';
import cover_page_image from '../icons/cover-page-image.jpg';
import FormResultsComponent from '../form_results_components/FormResultsComponent';
import { formatDate } from '../utils';
import pdf_icon from '../icons/file-pdf-icon.svg';
import PDFViewerComponent from '../PDFViewerComponent';
import jsPDF from 'jspdf';


const FormGroupPreview = ({formGroup, formSubs, updateFormGroup, }) => {

  
  const handleDownloadPDF = () => {
    const formTitle = formGroup.title;
    const input = document.getElementById("group-result-to-convert");
  
    const elementWidth = input.offsetWidth;
    const elementHeight = input.offsetHeight;
  
    const orientation = elementWidth > '700' ? "l" : "p";
  
    const pdf = new jsPDF(orientation, "mm", "a4");
    pdf.html(input, {
      callback: function (pdf) {
        pdf.save(`${formTitle}.pdf`);
      },
      x: 6,
      y: 4,
      html2canvas: { scale: 0.315 },
    });
  };
  

  return (
    <div className="form-group-cover-page-edit">
      <div className="header-section">
        <h1 className="header-title">Cover Page Editor</h1>
        <div className="button-group">
          
          <div onClick={() => handleDownloadPDF()} className='results-page-heading-action-button'>
            <img className="size24-icon" src={pdf_icon}/>
            Export to PDF
          </div>
        </div>
      </div>
      <div className="preview-container" id="group-result-to-convert">
        <div className="header-content">
          <img className='preview-cover-page-image' src={cover_page_image}/>
        </div>
        <div className="cover-page-content">
          <h1 className="document-title">{formGroup?.cover_page.title || 'Document Title'}</h1>
          <div className="info-section">
            <div>
              <p className="info-label">Prepared for:</p>
              <p className="info-value highlight">{formGroup?.cover_page.preparedFor || '[Client Name]'}</p>
            </div>
            
            <div>
              <p className="info-label">Prepared by:</p>
              <p className="info-value highlight">{formGroup?.cover_page.preparedBy || '[Company Name]'}</p>
            </div>
            
            <div>
              <p className="info-label">on</p>
              <p className="info-value highlight">
                {new Date(formGroup?.cover_page.date).toLocaleDateString('en-US', {
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
              {formGroup?.cover_page.confidentialityNote || 'The information contained in this report/document is for the exclusive use of the client.'}
            </p>
          </div>
        </div>
      <div className="form-result-container">
        {formGroup.forms && formGroup.forms.length !== 0 ? (
          formGroup.forms.map((form) => {
            console.log(form)
            if (!form.chosenSub) {
              return null;
            }

            const submissionData = formSubs.find(subm => subm._id === form.chosenSub);
            if (!submissionData) {
              return null;
            }
            console.log(submissionData)
            let displayVersion = submissionData.versions.find(
              version => version.versionNumber == form.chosenVersion
            );
            if(!displayVersion){
              displayVersion = submissionData
            }
            console.log(displayVersion)
            if (!displayVersion) {
              return null;
            }

            return displayVersion.fileData ? (
              <PDFViewerComponent key={form._id} form={displayVersion} />
            ) : (
              <form key={form._id} className="form-result-content" id="result-to-convert">
                <div className="form-result-timestamp">
                  {displayVersion.timestamp 
                    ? formatDate(displayVersion.timestamp)
                    : formatDate(submissionData.submittedAt)
                  }
                </div>
                {displayVersion.fields.map((field, index) => 
                  field.type === 'section' ? (
                    field.components.map((sectionComp, indexComp) => (
                      <FormResultsComponent 
                        key={`${index}-${indexComp}`} 
                        field={sectionComp} 
                        data={displayVersion.data} 
                      />
                    ))
                  ) : (
                    <FormResultsComponent 
                      key={index} 
                      field={field} 
                      data={displayVersion.data} 
                    />
                  )
                )}
              </form>
            );
          })
        ) : null}
      </div>
      </div>
    </div>
  );
};

export default FormGroupPreview;