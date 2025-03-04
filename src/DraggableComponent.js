import { useEffect } from 'react';
import { useDrag } from 'react-dnd';


const DraggableComponent = ({ type, title, fieldData, onDragStart, onDragEnd }) => {
  const [{ isDragging }, drag] = useDrag({
    type: type,
    item: {
      type: type, title: title,
      index:'bar_component',
      fieldData: fieldData || '',
      onDragStart,
      onDragEnd,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      onDragEnd();
    },
  });

useEffect(() => {
  if (isDragging) {
    onDragStart();
  }
}, [isDragging, onDragStart]);

  return (
    <div
      ref={drag}
      className={`form-builder-component ${isDragging ? 'dragging' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {title}
    </div>
  );
};

export default DraggableComponent;