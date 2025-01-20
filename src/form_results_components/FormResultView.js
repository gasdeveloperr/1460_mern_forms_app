import { useEffect, useState } from "react";
import PDFViewerComponent from "../PDFViewerComponent";
import FormResultsComponent from "./FormResultsComponent";
import arrow_menu_icon from '../icons/arrow-side-menu-icon.svg';
import pdf_icon from '../icons/file-pdf-icon.svg';
import dropdown_icon from '../icons/dropdown-icon.svg';
import edit_icon from '../icons/edit-form-icon.svg';
import { formatDate } from "../utils";

const FormResultView = ({form, currentVersion, toMainBoardHandler, 
  handleDownloadPDF, isVersionsDropdown, setIsVersionDropDown, 
  handleVersionChange, setEditingResultMode }) => {

  const [displayVersion, setDisplayVersion] = useState()

  
  useEffect(() => {
    if(form.versions && form.versions[currentVersion-1]){
      setDisplayVersion(form.versions[currentVersion-1])
      console.log('setted : ', form.versions[currentVersion-1])
    }else{
      setDisplayVersion(form)
    }
    console.log(' FormResultView displayVersion : ', displayVersion)

  },[form, currentVersion])

  
  return ( 
    <>
    {
      displayVersion && 
      <>
        <div className="results-page-heading">
          <div className="results-page-heading-title">
            <div className="dashboard-page-title">
              <div className="go-back-button" onClick={toMainBoardHandler} >
                <img src={arrow_menu_icon} alt="Go Back" />
              </div>
              {form.title} results
            </div>
            <div className="results-sub-title">
              {`submitted by ${form.submittedBy.email}`}
              {/* {`submitted by ${form.submittedBy.email} at ${formatDate(displayVersion?.timestamp)}`} */}
            </div>
          </div>
          <div className='results-page-heading-title-options'>
            <div onClick={() => setEditingResultMode(true)} className='results-page-heading-action-button'
              id='submit_changes'
              help-title="edit results">
              <img className="size24-icon" src={edit_icon}/>
            </div>
            {
            form && form.versions && form.currentVersion &&
            <div className="results-page-heading-versions-container">
              <div onClick={() => setIsVersionDropDown(prev=> !prev)} className='results-page-heading-versions-current'>
                <div>version {!currentVersion ? form.currentVersion : currentVersion}</div>
                {
                  form.versions?.length !== 0 &&
                  <div className='icon-flex-container'
                  style={{transform: isVersionsDropdown ? 'rotate(180deg)' : ''}}>
                    <img className='size22-icon' src={dropdown_icon} alt="⯆" />
                  </div>
                }
              </div>
              {
                isVersionsDropdown &&
                <div className="results-page-heading-versions-list">
                  {form.versions.map((version, versionIndex) => (
                    <div key={versionIndex} className="results-page-heading-versions-list-item"
                    onClick={() => handleVersionChange(version.versionNumber)}>
                      version {version.versionNumber}
                    </div>
                  ))}
                </div>
              }
            </div>
            }
            <div onClick={() => handleDownloadPDF()} className='results-page-heading-action-button'>
              <img className="size24-icon" src={pdf_icon}/>
              Export to PDF
            </div>
          </div>
        </div>
        <div className="form-result-container" id="result-to-convert">
          {
            displayVersion && displayVersion.fileData ?
            <PDFViewerComponent form={displayVersion} />
            :
            displayVersion &&
            <form className="form-result-content" >
              <div className="form-result-timestamp">
                {displayVersion?.timestamp ? `${formatDate(displayVersion?.timestamp)}`
                : `${formatDate(form?.submittedAt)}`}
              </div>
              {displayVersion.fields.map((field, index) => (
                field.type === 'section' ? 
                  field.components.map((sectionComp, indexComp) => (
                    <FormResultsComponent key={indexComp} field={sectionComp} data={displayVersion.data} />
                  ))
                : 
                  <FormResultsComponent key={index} field={field} data={displayVersion.data} />
              ))}
            </form>
          }
        </div>
      </>
    }
    </>
  );
}
 
export default FormResultView;