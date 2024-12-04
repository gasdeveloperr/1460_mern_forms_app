import PDFViewerComponent from "../PDFViewerComponent";
import FormResultsComponent from "./FormResultsComponent";

const FormResultView = ({form}) => {
  console.log(' FormResultView form : ', form)
  return ( 
    <div className="form-result-container">
      {
        form.fileData ?
        <PDFViewerComponent form={form} />
        :
        <form className="form-result-content" id="result-to-convert">
         {form.fields.map((field, index) => (
          field.type === 'section' ? 
            field.components.map((sectionComp, indexComp) => (
              <FormResultsComponent key={indexComp} field={sectionComp} data={form.data} />
            ))
          : 
            <FormResultsComponent key={index} field={field} data={form.data} />
        ))}
        </form>
      }
    </div>
  );
}
 
export default FormResultView;