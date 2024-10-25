import { useDrop } from 'react-dnd';
import { section_accept_types_array } from './consts';
import FormBuilderSectionField from './FormBuilderSectionField';

const FormBuilderSectionComponent = ({
  editingField, setEditingField,
  editingSectionField, setEditingSectionField,
  index, isDragging, setIsDragging, handleDrop, section}) => {

  const useDropArea = (drop_index, onDrop) => {
    const [, drop] = useDrop({
      accept: section_accept_types_array,
      drop: (item) => onDrop(item, drop_index, section.id),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    });
    return { drop };
  };

  const { drop: sectionDrop } = useDropArea(index, handleDrop);

  return (
    <>
    {
      section.components.length !== 0 ?
      section.components.map((field, index) => (
        <FormBuilderSectionField key={index} field={field} index={index}
          isDragging={isDragging} setIsDragging={setIsDragging}
          handleDrop={handleDrop} 
          editingField={editingField} setEditingField={setEditingField}
          editingSectionField={editingSectionField} setEditingSectionField={setEditingSectionField}/>
      ))
      :
      <div ref={sectionDrop} className={`section-drop-area ${isDragging ? 'section-drop-over' : ''}`}/>
    }
    </>
  );
};

export default FormBuilderSectionComponent;