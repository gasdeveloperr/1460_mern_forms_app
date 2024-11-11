import plus_icon from '../icons/plus-icon.svg'

const AddButtonComponent = ({ field, index, handleAddingComponent }) => {

  return (
    <div className="form-live-adding-button" onClick={() => handleAddingComponent(field, index)}>
      <img src={plus_icon}/>
      {field.adding_component.type ? 
      'Add '+field.adding_component.type.replace(/_/g, ' ')+' field'
      : field.title }
    </div>
  );
};

export default AddButtonComponent;
