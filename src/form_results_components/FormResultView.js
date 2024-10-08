import PDFViewerComponent from "../PDFViewerComponent";
import FormResultsComponent from "./FormResultsComponent";

const FormResultView = ({form}) => {
  return ( 
    <div className="form-live-container">
      {
        form.fileData ?
        <PDFViewerComponent form={form} />
        :
        <form className="form-live-content">
          {form.fields.map((field, index) => (
             <FormResultsComponent key={index} field={field} data={form.data}/>
            )
          )}
        </form>
      }
    </div>
  );
}
 
export default FormResultView;