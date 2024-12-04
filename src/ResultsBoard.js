import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import axios from 'axios';
import Spinner from './Spinner';
import { backend_point } from './consts';
import { formatDate, getAuthToken } from './utils';
import FormResultView from './form_results_components/FormResultView';
import arrow_menu_icon from './icons/arrow-side-menu-icon.svg';
import pdf_icon from './icons/file-pdf-icon.svg';
import './ResultsBoardPage.css';
import jsPDF from 'jspdf';

function ResultsBoard() {
  // const [forms, setForms] = useState([]);
  const [submForms, setSubmForms] = useState([]);
  const [currentSubmForms, setCurrentSubmForms] = useState([]);
  const [currentSubmFormName, setCurrentSubmFormName] = useState('');

  const [detailResult, setDetailResult] = useState()

  const toMainBoardHandler = () => {
    setDetailResult()
  }
  
  const { formId } = useParams();
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if(formId){

    }
  }, [])

  useEffect(() => {
    if (formId && submForms.length > 0) {
      const filteredForms = submForms.filter((form) => form.formId === formId);
      setCurrentSubmForms(filteredForms);

      if (filteredForms.length > 0) {
        setCurrentSubmFormName(filteredForms[0].title); // Assuming 'name' is the field in submForms
      }

      setIsLoading(false);
    }
    console.log('currentSubmForms', currentSubmForms)
  }, [submForms])

  useEffect(() => {
    const token = getAuthToken();
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };
    
    const fetchData = async () => {
      try {
        const submFormsResponse = await axios.get(`${backend_point}/api/subm_forms/all`, config);
        setSubmForms(submFormsResponse.data);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    setIsLoading(true);
    fetchData();
  }, []);

  // const handleImportPDF = (resultsData) => {
  //   const form = resultsData;
  //   const data = detailResult.data;
  //   const formTitle = form.title
  //   const doc = new jsPDF();

  //   doc.setFontSize(14);
  //   doc.setTextColor(69, 85, 96);

  //   const paragraphTab = 24;
  //   const cellMargin = 6;
  //   const componentMargin = 8;
  //   const fieldsMargin = 10;
  //   const titleMargin = 12;
  
  //   let y = 12; // Y position to start printing the fields
  //   const labelWidth = 70; // Width of label cells
  //   const answerWidth = 100; // Width of answer cells
  //   const cellHeight = 10; // Height for each cell row

  //   let fieldData = {};
  //   doc.setFillColor('#cf3f3f')

  //   form.fields.map((field, index) => {
  //     if(field.type === 'section') {
  //       field.components.map((sectionComp, indexComp) => {
  //         if(sectionComp.type === 'columns'){
  //           doc.setFont(undefined, 'bold');
  //           doc.setFontSize(14);
  //           doc.text(`${sectionComp.title}: `, paragraphTab, y);
  //           y += componentMargin;
  //           sectionComp.labels.map((label, columnIndex) => {
  //             if (data && data.hasOwnProperty(sectionComp.id) && data[sectionComp.id] !== undefined) {
  //               fieldData = data[sectionComp.id];
  //               doc.setFont(undefined, 'bold');
  //               doc.setFontSize(14);
  //               doc.text(label, paragraphTab*(columnIndex+1), y);
  //               doc.setFont(undefined, 'normal');
  //               doc.setFontSize(12);
  //               doc.text(fieldData.value[columnIndex] || 'N/A', paragraphTab*(columnIndex+1), y+cellMargin);
  //               console.log('text in doc section : ', fieldData)
  //             }
  //           })
  //           y += fieldsMargin;
  //         }else{
  //           if (data && data.hasOwnProperty(sectionComp.id) && data[sectionComp.id] !== undefined) {
  //             //console.log(data[sectionComp.id]);
  //             fieldData = data[sectionComp.id];
  //             doc.setFont(undefined, 'bold');
  //             doc.setFontSize(14);
  //             doc.text(`${sectionComp.title}: `, paragraphTab, y);
  //             y += componentMargin;
  //             doc.setFont(undefined, 'normal');
  //             doc.setFontSize(12);
  //             doc.text(fieldData.value || 'N/A', paragraphTab, y);
  //             y += componentMargin;
  //             console.log('text in doc section : ', fieldData)
  //           } else {
  //             if(sectionComp.type === 'title'){
  //               doc.setFontSize(16);
  //               doc.setFont(undefined, 'bold');
  //               const titleColor = sectionComp.color || '#FFFFFF'
  //               doc.setFillColor(titleColor)
  //               doc.text(`${sectionComp.title}`, paragraphTab, y);
  //               doc.setFillColor('#FFFFFF');
  //               y += titleMargin;
  //             }
  //           }
  //         }
  //       })
  //       y += fieldsMargin;
  //     } else 
  //     if(field.type === 'columns'){
  //       doc.setFont(undefined, 'bold');
  //       doc.setFontSize(14);
  //       doc.text(`${field.title} :`, paragraphTab, y);
  //       y += componentMargin;
  //       field.labels.map((label, columnIndex) => {
  //         if (data && data.hasOwnProperty(field.id) && data[field.id] !== undefined) {
  //           //console.log(data[sectionComp.id]);
  //           fieldData = data[field.id];
  //           doc.setFont(undefined, 'bold');
  //           doc.setFontSize(14);
  //           doc.text(label, paragraphTab*(columnIndex+1), y);
  //           doc.setFont(undefined, 'normal');
  //           doc.setFontSize(12);
  //           doc.text(fieldData.value[columnIndex] || 'N/A', paragraphTab*(columnIndex+1), y+cellMargin);
  //           console.log('text in doc section : ', fieldData)
  //         }
  //       })
  //       y += fieldsMargin;
  //     } else 
  //     if(data && data.hasOwnProperty(field.id) && data[field.id] !== undefined){
  //       fieldData = data[field.id]
  //       doc.setFont(undefined, 'bold');
  //       doc.setFontSize(14);
  //       //doc.rect(paragraphTab, y, labelWidth, cellHeight, 'FD'); 
  //       doc.text(`${field.title} :`, paragraphTab, y);
  //       y += componentMargin;
  //       doc.setFont(undefined, 'normal');
  //       doc.setFontSize(12);
  //       doc.text(fieldData.value || 'N/A', paragraphTab, y);
  //       y += fieldsMargin;
  //       console.log('text in doc  : ', fieldData)
  //     }else{
  //       if(field.type === 'title'){
  //         doc.setFontSize(16);
  //         doc.setFont(undefined, 'bold');
  //         const titleColor = field.color || '#FFFFFF'
  //         console.log('titleColor : ', field, titleColor)
  //         doc.setFillColor(titleColor)
  //         doc.text(`${field.title}`, paragraphTab, y);
  //         doc.setFillColor(196, 74, 137, 0.8)
  //         y += titleMargin;
  //       }
  //     }
  //   })
  //   doc.save(formTitle+'.pdf');
  // };

  // const handleDownloadPDF = () => {
  //   const formTitle = detailResult.title
  //   const input = document.getElementById("result-to-convert"); // The div or section to convert
  //   html2canvas(input).then((canvas) => {
  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF("p", "mm", "a4");
  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  //     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  //     pdf.save(formTitle+'.pdf');
  //   });
  // };
  const handleDownloadPDF = () => {
    const formTitle = detailResult.title;
    const input = document.getElementById("result-to-convert");
  
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
    <div>
      <Header />
      {
        isLoading ?
          <Spinner/>
        : 
        <div className="dashboard-results-body">
          <div className="results-page-heading">
            <div className="results-page-heading-title">
              <div className="dashboard-page-title">
              {detailResult ? 
                <div className="go-back-button" onClick={toMainBoardHandler} >
                  <img src={arrow_menu_icon} alt="Go Back" />
                </div>
              :
                <a href='/forms/dashboard' className="go-back-button" >
                  <img src={arrow_menu_icon} alt="Go Back" />
                </a>
              }
                {currentSubmFormName} results
              </div>
              <div className="results-sub-title">
                {detailResult ? `by ${detailResult.submittedBy.email} at ${formatDate(detailResult.submittedAt)}` : ''}
              </div>
            </div>
            {
            detailResult &&
              <div onClick={() => handleDownloadPDF()} className='results-page-heading-action-button'>
                <img className="size24-icon" src={pdf_icon}/>
                Import PDF
              </div>
            }
          </div>
          {detailResult ? 
          <FormResultView form={detailResult}/>
          :
          <div className="dashboard-page-content"> 
              <div className="clients-table-container">
                <table className="clients-table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Submitted by</th>
                      <th>Submitted time</th>
                      <th>Results</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentSubmForms.map((form, formIndex) => (
                      <tr key={`${form._id}`}>
                        <td className="form-index">
                          {formIndex+1}.
                        </td>
                        <td>
                          {form.submittedBy.email}
                        </td>
                        <td className="client-index">
                          {formatDate(form.submittedAt)}
                        </td>
                        <td className="see-results-button" onClick={() => setDetailResult(form)}>
                          <p>See details</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </div>}
        </div>
      }
    </div>
  );
}

export default ResultsBoard;