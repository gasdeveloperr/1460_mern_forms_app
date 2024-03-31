import trash_icon from './icons/trash-can.svg'

const RemoveButton = ({opacityVal, onClick }) => {
  return (
    <button className="remove-button" style={{opacity: opacityVal}} onClick={onClick}>
      <img src={trash_icon} className="remove-icon"/>
    </button>
  );
};

export default RemoveButton;