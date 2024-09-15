import FormResultsComponent from "./FormResultsComponent";
import FormLiveComponent from "../FormLiveComponent";

const FormResultView = ({form, goBack}) => {
  return ( 
    <div className="form-live-container">
      <form className="form-live-content">
        {form.fields.map((field, index) => (
           <FormResultsComponent key={index} field={field} data={form.data}/>
          )
        )}
      </form>
    </div>
  );
}
 
export default FormResultView;