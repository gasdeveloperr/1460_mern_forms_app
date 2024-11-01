import { useDrop } from 'react-dnd';
import { accept_types_array } from './consts';

const FieldDropZone = ({index, isDragging, handleDrop, position, sectionId}) => {

  const useDropArea = (drop_index, onDrop) => {
    const [, drop] = useDrop({
      accept: accept_types_array,
      drop: (item) => onDrop(item, drop_index, sectionId || ''),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    });
    return { drop };
  };

  const { drop: dropTop } = useDropArea(index, handleDrop);
  const { drop: dropBottom } = useDropArea(index + 1, handleDrop);

  return (
    <>
    {
      position === 'top' ?
      <div ref={dropTop} className={`drop-area drop-top ${isDragging ? 'drop-over' : ''}`}/>
      :
      <div ref={dropBottom} className={`drop-area drop-bottom ${isDragging ? 'drop-over' : ''}`}/> 
    }
    </>
  );
};

export default FieldDropZone;