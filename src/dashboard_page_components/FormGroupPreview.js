import React, { useState } from 'react';
import cover_page_image from '../icons/cover-page-image.jpg';
import FormResultsComponent from '../form_results_components/FormResultsComponent';
import { formatDate } from '../utils';
import pdf_icon from '../icons/file-pdf-icon.svg';
import PDFViewerComponent from '../PDFViewerComponent';
import html2pdf from 'html2pdf.js';


const FormGroupPreview = ({formGroup, formSubs, }) => {

  const handleDownloadPDF = async () => {
    const formTitle = formGroup.title;
    
    const tempContainer = document.createElement('div');
    tempContainer.style.visibility = 'hidden';
    tempContainer.style.position = 'absolute';
    tempContainer.style.zIndex = '-9999';
    document.body.appendChild(tempContainer);
  
    // Clone the preview container
    const previewContainer = document.querySelector('.preview-container');
    const clone = previewContainer.cloneNode(true);
    
    // Add specific styles for PDF generation
    const style = document.createElement('style');
    style.textContent = `
      .div-to-convert {
        margin-top: 20px;
        margin-bottom: 0px;
      }
      .last-element {
        page-break-after: avoid !important;
      }
      .div-to-convert:not(:last-child) {
        page-break-after: always;
      }
      img.preview-cover-page-image {
        max-width: 100%;
        height: auto;
      }
      .form-result-content {
        width: 100%;
      }
      .preview-container {
        padding: 0 12px;
        margin: 0;
        border: none;
        background-color: white;
      }
    `;
    clone.prepend(style);
    tempContainer.appendChild(clone);
  
    // Configure html2pdf options
    const opt = {
      margin: [0, 0, 0, 0],
      filename: `${formTitle}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: true,
        letterRendering: true,
        allowTaint: true,
        removeContainer: true,
        // Prevent extra whitespace
        scrollY: 0,
        windowHeight: window.document.documentElement.scrollHeight
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true,
        putTotalPages: false
      },
      pagebreak: { 
        mode: ['avoid-all', 'css'],
        after: '.div-to-convert'
      }
    };

    try {
      await html2pdf().from(clone).set(opt).save();
    } catch (error) {
      console.error('PDF generation error:', error);
    } finally {
      document.body.removeChild(tempContainer);
    }
    };

  return (
    <div className="form-group-cover-page-edit">
      <div className="header-section">
        <h1 className="header-title">Group Report</h1>
        <div className="button-group">
          <div onClick={() => handleDownloadPDF()} className='results-page-heading-action-button'>
            <img className="size24-icon" src={pdf_icon}/>
            Export to PDF
          </div>
        </div>
      </div>
      <div className="preview-container">
        {
          formGroup.cover_page &&
          <div className="div-to-convert">
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
          </div>
        }
        {formGroup.forms && formGroup.forms.length !== 0 && (
          formGroup.forms.map((form, formIndex) => {
            if (!form.chosenSub) {
              return null;
            }
            const submissionData = formSubs.find(subm => subm._id === form.chosenSub);
            if (!submissionData) {
              return null;
            }
            let displayVersion = submissionData.versions.find(
              version => version.versionNumber == form.chosenVersion
            );
            if(!displayVersion){
              displayVersion = submissionData
            }
            if (!displayVersion) {
              return null;
            }
            const isLastPage = formGroup.forms.length-1 === formIndex ? 'last-element': ''
            return displayVersion.fileData ? (
              <div className={`div-to-convert ${isLastPage}`}>
                <PDFViewerComponent key={form._id} form={displayVersion} />
              </div>
            ) : (
              <form key={form._id} className={`form-result-content div-to-convert ${isLastPage}`} id="result-to-convert">
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
        )}
      </div>
    </div>
  );
};

export default FormGroupPreview;