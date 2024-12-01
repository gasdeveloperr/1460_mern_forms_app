import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import '../clients_page_components/ClientsTable.css';
import './DashboardPage.css';
import { getUserRole } from '../utils';
import drag_icon from '../icons/draggable-icon.svg';
import save_icon from '../icons/save-green-icon.svg';
import trash_icon from '../icons/trash-can.svg'

const ITEM_TYPE = 'FORM';

const DraggableRow = ({ form, index, moveForm, groupIndex, chooseFormToRemoveFromGroup }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: ITEM_TYPE,
    item: { index, groupIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: ITEM_TYPE,
    hover: (draggedItem) => {
      if (draggedItem.index !== index || draggedItem.groupIndex !== groupIndex) {
        moveForm(draggedItem.index, index, groupIndex);
        draggedItem.index = index;
        draggedItem.groupIndex = groupIndex;
      }
    },
  });

  return (
    <td
      ref={(node) => dragRef(dropRef(node))}
      style={{
        opacity: isDragging ? 0.5 : 1,
      }}
      align="center"
      className="draggable-td"
    >
      {/* <img src={drag_icon} alt="☷" />  */}
      <span>☷</span> {form.title}
      <img className='table-trash-icon' src={trash_icon} alt="remove"  onClick={() => chooseFormToRemoveFromGroup(form._id, form.groupId)}/>  
    </td>
  );
};

const FormGroupsTable = ({ forms, formGroups, moveForm, isSaveMode, saveFormsOrder, chooseFormToRemoveFromGroup }) => {
  const userRole = getUserRole();

  return (
    <div className="clients-table-container">
      <table className="clients-table">
        <thead>
          <tr>
            <th></th>
            <th>Title</th>
            <th>Form's order</th>
          </tr>
        </thead>
        <tbody>
          {formGroups.map((group, groupIndex) => (
            <React.Fragment key={groupIndex}>
                {group.forms.length !== 0 ? 
                  group.forms.map((formId, formIndex) => {
                    const form = forms.find((form) => form._id === formId);
                    if (!form) return null;
                    return (
                      <tr>
                        {formIndex === 0 && (
                          <>
                            <td className="client-index" rowSpan={group.forms.length}>
                              {groupIndex + 1}.
                            </td>
                            <td className="group-title" rowSpan={group.forms.length}>
                              {group.title}
                              {
                                isSaveMode === group._id && 
                                <img src={save_icon} onClick={() => saveFormsOrder()} alt="save" />
                              }
                            </td>
                          </>
                        )}
                        <DraggableRow
                          key={formId}
                          form={form}
                          index={formIndex}
                          moveForm={moveForm}
                          groupIndex={groupIndex}
                          chooseFormToRemoveFromGroup={chooseFormToRemoveFromGroup}
                        />
                      </tr>
                    );
                  })
                :
                <tr>
                  <td className="client-index" >
                    {groupIndex + 1}.
                  </td>
                  <td className="group-title">
                    {group.title}
                    {
                      isSaveMode === group._id && 
                      <img src={save_icon} onClick={() => saveFormsOrder()} alt="save" />
                    }
                  </td>
                  <td>
                  </td>
                </tr>
                }
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FormGroupsTable;