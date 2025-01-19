import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import '../clients_page_components/ClientsTable.css';
import './DashboardPage.css';
import { getUserRole } from '../utils';
import drag_icon from '../icons/draggable-icon.svg';
import save_icon from '../icons/save-green-icon.svg';
import trash_icon from '../icons/trash-can.svg'
import edit_icon from '../icons/edit-form-icon.svg'
import open_icon from '../icons/open-form-icon.svg'

const ITEM_TYPE = 'FORM';

const DraggableRow = ({ form, group, index, moveForm, groupIndex, 
  handleOpenSubChoser, chooseFormToRemoveFromGroup }) => {
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
      <img className='table-trash-icon' src={trash_icon} alt="remove"  onClick={() => chooseFormToRemoveFromGroup(form._id, group._id)}/>  
      <span className='form-chose-submission-button' onClick={() => handleOpenSubChoser(group, form)}>&#9;&#9;Chose Submissions</span>
    </td>
  );
};

const FormGroupsTable = ({ forms, formGroups, changeTitle, moveForm, 
  isSaveMode, saveFormGroupChanges, chooseFormToRemoveFromGroup,
  handleOpenEditor, handleOpenGroupPreview, handleOpenSubChoser }) => {

  const userRole = getUserRole();

  return (
    <div className="clients-table-container">
      <table className="clients-table">
        <thead>
          <tr>
            <th></th>
            <th>Title</th>
            {userRole === 'admin' && <th>Cover page</th>}
            {userRole === 'admin' && <th>Report view</th>}
            <th>Form's order</th>
          </tr>
        </thead>
        <tbody>
          {formGroups.map((group, groupIndex) => (
            <React.Fragment key={groupIndex}>
                {group.forms.length !== 0 ? 
                  group.forms.map((formData, formIndex) => {
                    const form = forms.find((form) => form._id === formData.formId);
                    if (!form) return null;
                    return (
                      <tr>
                        {formIndex === 0 && (
                          <>
                            <td className="client-index" rowSpan={group.forms.length}>
                              {groupIndex + 1}.
                            </td>
                            <td className="group-title" rowSpan={group.forms.length}>
                              <div className='group-title-container'>
                                <input 
                                  value={group.title}
                                  onChange={(e) => changeTitle(groupIndex, e.target.value)}
                                />
                                {
                                  isSaveMode === group._id && 
                                  <img src={save_icon} onClick={() => saveFormGroupChanges()} alt="save" />
                                }
                              </div>
                            </td>
                            {userRole === 'admin' && (
                              <td className="group-title" rowSpan={group.forms.length}>
                                <div onClick={() => handleOpenEditor(group)}>
                                  <img className='size24-icon' src={edit_icon} alt=''/>
                                </div>
                              </td>
                            )}
                            {userRole === 'admin' && (
                              <td className="group-title" rowSpan={group.forms.length}>
                                <div onClick={() => handleOpenGroupPreview(group)}>
                                  <img className='size26-icon' src={open_icon} alt=''/>
                                </div>
                              </td>
                            )}
                          </>
                        )}
                        <DraggableRow
                          key={formData.formId}
                          form={form}
                          group={group}
                          index={formIndex}
                          moveForm={moveForm}
                          groupIndex={groupIndex}
                          handleOpenSubChoser={handleOpenSubChoser}
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
                    <div className='group-title-container'>
                      <input 
                        value={group.title}
                        onChange={(e) => changeTitle(groupIndex, e.target.value)}
                      />
                      {
                        isSaveMode === group._id && 
                        <img src={save_icon} onClick={() => saveFormGroupChanges()} alt="save" />
                      }
                    </div>
                  </td>
                  {userRole === 'admin' && (
                    <td className="group-title">
                      <div onClick={() => handleOpenEditor(group)}>
                        <img className='size24-icon' src={edit_icon} alt=''/>
                      </div>
                    </td>
                  )}
                  {userRole === 'admin' && (
                    <td className="group-title">
                      <div onClick={() => handleOpenGroupPreview(group)}>
                        <img className='size26-icon' src={open_icon} alt=''/>
                      </div>
                    </td>
                  )}
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
