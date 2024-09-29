import { useState, useEffect } from 'react';

const PDFViewerComponent = ({ form }) => {
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    if (form && form.fileData && form.fileData.fileUrl) {
      const fileUrl = form.fileData.fileUrl; // Your file URL from the form
      setPdfUrl(fileUrl); // Fetch the PDF and convert to data URL
    }
  }, [form]);


  if (!pdfUrl) {
    return <div>Loading form`s file...</div>;
  }

  return (
    <div>
      <h3>{form.title}</h3>
       <div>
          <iframe src={pdfUrl} width='1000px' height='1200px' />
        </div>
    </div>
  );
};

export default PDFViewerComponent;
