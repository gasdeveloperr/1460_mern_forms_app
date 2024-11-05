import plus_icon from '../icons/plus-icon.svg'

const AddButtonComponent = ({ field, handleAddingComponent }) => {

  return (
    <div className="form-live-adding-button" onClick={() => handleAddingComponent(field)}>
      <img src={plus_icon}/>
      {field.adding_component.type ? 
      'Add '+field.adding_component.type.replace(/_/g, ' ')+' component'
      : field.title }
    </div>
  );
};

export default AddButtonComponent;
