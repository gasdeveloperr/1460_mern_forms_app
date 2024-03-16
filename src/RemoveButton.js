import trash_icon from './icons/trash-can.svg'

const RemoveButton = ({ onClick }) => {
  return (
    <button className="remove-button" onClick={onClick}>
      <img src={trash_icon} className="remove-icon"/>
    </button>
  );
};

export default RemoveButton;