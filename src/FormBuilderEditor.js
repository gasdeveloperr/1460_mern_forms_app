import { useContext, useEffect, useState } from 'react';
import './FormBuilderEditor.css';
import { OutsideClickContext } from './OutsideClickContext';
import { ordinalArray, readonly_types_array, titles_to_types_object } from './consts';
import trash_icon from './icons/trash-can.svg'
import plus_icon from './icons/plus-icon.svg'
import save_icon from './icons/save-icon.svg'
import add_corrective_action_icon from './icons/add-corrective-action-icon.svg'
import chooser_options_icon from './icons/chooser-options.svg'
import duplicate_icon from './icons/duplicate-icon.svg'
import { HexColorPicker  } from "react-colorful";
import convert from "color-convert"; 
import ComponentTypeSelector from './ComponentTypeSelector';
import LegacyComponentsOptions from './form_builder_editor_components/LegacyComponentsOptions';
import ColumnsTypeSelector from './form_builder_editor_components/ColumnsTypeSelector';
import DropdownOptions from './form_builder_editor_components/DropdownOptions';

const FieldBuilderEditor = ({updateFormField, removeFormField, duplicateField, editingField, setEditingField,
  handleDuplicateClick, handleOptionsSaving, chooseOptionsToChange, 
  chooseOptionToAddCorrectiveAction, chooseOptionToRemoveCorrectiveAction,
  setIsCustomFieldSavingWindow}) => {

  const changeFieldTitleHandler = (e) => {
    setEditingField({...editingField, title: e.target.value})
    updateFormField(editingField.id, { ...editingField, title: e.target.value })
    //console.log('changeFieldTitleHandler editingField : ', editingField)
  }
  const changeFieldLabelHandler = (e, index) => {
    const updatedLabels = [...editingField.labels];
    updatedLabels[index] = e.target.value;
    setEditingField({ ...editingField, labels: updatedLabels });
    updateFormField(editingField.id, { ...editingField, labels: updatedLabels })
    //console.log('changeFieldLabelHandler editingField : ', editingField)
  };
  const changeFieldRequiredHandler = (e) => {
    setEditingField({...editingField, required: !editingField.required})
    updateFormField(editingField.id, { ...editingField, required: !editingField.require})
    //console.log('change editingField : ', editingField)
  }  
  const changeFieldReadOnlyHandler = (e) => {
    setEditingField({...editingField, read_only: !editingField.read_only})
    updateFormField(editingField.id, { ...editingField, read_only: !editingField.read_only})
    //console.log('change editingField : ', editingField)
  }  
  const changeFieldPreFilledHandler = (e) => {
    setEditingField({...editingField, value: e.target.value})
    updateFormField(editingField.id, { ...editingField, value: e.target.value})
  } 

  const changeSectionFieldPreFilledHandler = (e, sectionIndex) => {
    let newValues = [...editingField.value];
    newValues[sectionIndex] = e.target.value;
  
    // Log the updated value for debugging
    //console.log('Updated editingField.value:', newValues);
  
    // Update the editingField state with the modified value array
    setEditingField({...editingField, value: newValues});
    updateFormField(editingField.id, { ...editingField, value: newValues})
  };
  const changeColumnFieldPreFilledHandler = (e, columnIndex) => {
    
    const newValue = [...editingField.value];
    newValue[columnIndex].value = e.target.value;
    //console.log('newValue: ',  newValue)
    setEditingField({ ...editingField, value: newValue });
    updateFormField(editingField.id, { ...editingField, value: newValue})
  };
  const changeColumnsStyleHandler = (e) => {
    let newStyle = 'tabular'
    if(editingField.style && editingField.style === 'tabular'){
      newStyle = ''
    }
    setEditingField({...editingField, style: newStyle})
    updateFormField(editingField.id, { ...editingField, style: newStyle})
  }  


  const addFieldBoxOptionHandler = (index) => {
    const newCheckboxes = [...editingField.options.slice(0, index+1),{title: 'Option', checked: false}, ...editingField.options.slice(index+1, editingField.options.length+1)]
    setEditingField({...editingField, options: newCheckboxes})
    updateFormField(editingField.id, { ...editingField, options: newCheckboxes})
  } 
  const deleteFieldBoxOptionHandler = (index) => {
    const newCheckboxes = [...editingField.options.slice(0, index), ...editingField.options.slice(index+1, editingField.options.length+1)]
    setEditingField({...editingField, options: newCheckboxes})
    updateFormField(editingField.id, { ...editingField, options: newCheckboxes})
  } 
  const changeFieldBoxOptionHandler = (e, index) => {
    const newCheckboxes = editingField.options.map((option, opt_index) => {
      if(opt_index === index){
        return { ...option, title: e.target.value };
      }else{
        return option
      }
    })
    setEditingField({...editingField, options: newCheckboxes})
    updateFormField(editingField.id, { ...editingField, options: newCheckboxes})
  } 
  const changeFieldBoxLayoutHandler = (e) => {
    setEditingField({...editingField, layout: e.target.value})
    updateFormField(editingField.id, { ...editingField, layout: e.target.value})
    //console.log('change editingField : ', editingField)
  } 

  const addFieldListOptionHandler = (index) => {
    Object.defineProperty(editingField, 'dropdown', {
      get() {
        return this.options;
      },
      set(value) {
        this.options = value;
      }
    });
    const newOptions = [...editingField.options.slice(0, index+1),{title: 'Option', checked: false}, ...editingField.options.slice(index+1, editingField.options.length+1)]
    setEditingField({...editingField, options: newOptions})
    updateFormField(editingField.id, { ...editingField, options: newOptions})
  } 
  const deleteFieldListOptionHandler = (index) => {
    Object.defineProperty(editingField, 'dropdown', {
      get() {
        return this.options;
      },
      set(value) {
        this.options = value;
      }
    });
    const newOptions = [...editingField.options.slice(0, index), ...editingField.options.slice(index+1, editingField.options.length+1)]
    setEditingField({...editingField, options: newOptions})
    updateFormField(editingField.id, { ...editingField, options: newOptions})
  } 
  const changeFieldListOptionHandler = (e, index) => {
    Object.defineProperty(editingField, 'dropdown', {
      get() {
        return this.options;
      },
      set(value) {
        this.options = value;
      }
    });
    const newOptions = editingField.options.map((option, opt_index) => {
      if(opt_index === index){
        option.title = e.target.value
        return option
      }else{
        return option
      }
    })
    setEditingField({...editingField, options: newOptions})
    updateFormField(editingField.id, { ...editingField, options: newOptions})
  } 
  const addListOptionHandlerInColumns = (index, sectionIndex) => {
    const newOptions = [
      ...editingField.value[sectionIndex].options.slice(0, index + 1),
      { title: 'Option', selected: false }, // Default new option
      ...editingField.value[sectionIndex].options.slice(index + 1),
    ];
  
    const newValue = [...editingField.value];
    newValue[sectionIndex].options = newOptions;
  
    setEditingField({ ...editingField, value: newValue });
    updateFormField(editingField.id, { ...editingField, value: newValue})
  };
  const deleteListOptionHandlerInColumns = (index, sectionIndex) => {
    const newOptions = [
      ...editingField.value[sectionIndex].options.slice(0, index),
      ...editingField.value[sectionIndex].options.slice(index + 1),
    ];
  
    const newValue = [...editingField.value];
    newValue[sectionIndex].options = newOptions;
  
    setEditingField({ ...editingField, value: newValue });
    updateFormField(editingField.id, { ...editingField, value: newValue})
  };
  const changeListOptionHandlerInColumns = (e, index, sectionIndex) => {
    const newOptions = editingField.value[sectionIndex].options.map((option, opt_index) => {
      if (opt_index === index) {
        return { ...option, title: e.target.value };
      }
      return option;
    });
    const newValue = [...editingField.value];
    newValue[sectionIndex].options = newOptions;
  
    setEditingField({ ...editingField, value: newValue });
    updateFormField(editingField.id, { ...editingField, value: newValue})
  };

  const addBoxOptionHandlerInColumns = (index, sectionIndex) => {
    const newOptions = [
      ...editingField.value[sectionIndex].options.slice(0, index+1),
      {title: 'Option', checked: false}, 
      ...editingField.value[sectionIndex].options.slice(index+1)]
      
    const newValue = [...editingField.value];
    newValue[sectionIndex].options = newOptions;
    setEditingField({ ...editingField, value: newValue });
    updateFormField(editingField.id, { ...editingField, value: newValue})
  };

  const deleteBoxOptionHandlerInColumns = (index, sectionIndex) => {
    const newOptions = [
      ...editingField.value[sectionIndex].options?.slice(0, index),
      ...editingField.value[sectionIndex].options?.slice(index+1)
    ]
      
    const newValue = [...editingField.value];
    newValue[sectionIndex].options = newOptions;
    setEditingField({ ...editingField, value: newValue });
    updateFormField(editingField.id, { ...editingField, value: newValue})
  } 
  const changeBoxOptionHandlerInColumns = (e, index, sectionIndex) => {
    const newOptions = editingField.value[sectionIndex].options.map((option, opt_index) => {
      if(opt_index === index){
        return { ...option, title: e.target.value };
      }else{
        return option
      }
    })
    const newValue = [...editingField.value];
    newValue[sectionIndex].options = newOptions;
  
    setEditingField({ ...editingField, value: newValue });
    updateFormField(editingField.id, { ...editingField, value: newValue})
  }
  const changeBoxLayoutHandlerInColumns = (e, columnIndex) => {
    const newValue = [...editingField.value];
    newValue[columnIndex].layout = e.target.value;
    setEditingField({ ...editingField, value: newValue });
    updateFormField(editingField.id, { ...editingField, value: newValue})
  } 

  const changeFieldReadOnlyHandlerInColumn = (columnIndex) => {
    const newValues = editingField.value.map((column, column_index) => {
      if(column_index === columnIndex){
        return { ...column, read_only: !column.read_only };
      }else{
        return column
      }
    })
    setEditingField({ ...editingField, value: newValues });
    updateFormField(editingField.id, { ...editingField, value: newValues})
  } 

  const [colorPickerVisible, setColorPickerVisible] = useState(null);
  const [color, setColor] = useState(editingField.color);

  const [hexColor, setHexColor] = useState();
  const [rgbColor, setRgbColor] = useState();
  const [cmykColor, setCmykColor] = useState();

  useEffect(() => {
    if (editingField.color && !hexColor && editingField.type === 'title') {
      if (editingField.color.includes('rgba')) {
        // Extract rgba values from string
        const rgbaValues = editingField.color.match(/rgba?\((\d+), (\d+), (\d+),? (\d+\.?\d*)?\)/);
        if (rgbaValues) {
          const rgbaArray = [
            parseInt(rgbaValues[1]), // Red
            parseInt(rgbaValues[2]), // Green
            parseInt(rgbaValues[3])  // Blue
          ];
  
          const hex = convert.rgb.hex(rgbaArray); // Convert array to hex
          setColor(hex);
          setHexColor(hex);
          setRgbColor(convert.hex.rgb(hex));
          setCmykColor(convert.hex.cmyk(hex));
  
          //console.log('Converted RGBA to HEX:', hex);
        } else {
          setColor(editingField.color);
          setHexColor(editingField.color);
          setRgbColor(convert.hex.rgb(editingField.color));
          setCmykColor(convert.hex.cmyk(editingField.color));
        }
      } else {
        setColor(editingField.color);
        setHexColor(editingField.color);
        setRgbColor(convert.hex.rgb(editingField.color));
        setCmykColor(convert.hex.cmyk(editingField.color));
      }
    }
    if(!editingField.color && editingField.type === 'title'){
      const startHex = '#FFFFFF'
      setColor(startHex);
      setHexColor(startHex);
      setRgbColor(convert.hex.rgb(startHex));
      setCmykColor(convert.hex.cmyk(startHex));
    }
  }, [editingField]);
  
  useEffect(() => {
    //console.log('Updated color:', color);
  }, [color]);
  
  const toggleColorPicker = (index, startColor) => {
    if(startColor){
      if (startColor.includes('rgba')) {
        const rgbaValues = startColor.match(/rgba?\((\d+), (\d+), (\d+),? (\d+\.?\d*)?\)/);
        if (rgbaValues) {
          const rgbaArray = [
            parseInt(rgbaValues[1]), // Red
            parseInt(rgbaValues[2]), // Green
            parseInt(rgbaValues[3])  // Blue
          ];
  
          const hex = convert.rgb.hex(rgbaArray); // Convert array to hex
          setColor(hex);
          setHexColor(hex);
          setRgbColor(convert.hex.rgb(hex));
          setCmykColor(convert.hex.cmyk(hex));
        } else {
          setColor(startColor);
          setHexColor(startColor);
          setRgbColor(convert.hex.rgb(startColor));
          setCmykColor(convert.hex.cmyk(startColor));
        }
      } else {
        setColor(startColor);
        setHexColor(startColor);
        setRgbColor(convert.hex.rgb(startColor));
        setCmykColor(convert.hex.cmyk(startColor));
      }
    }
    setColorPickerVisible(colorPickerVisible === index ? null : index);
  };

  const changeTitleColorHandler = (color) => {
    setColor(color);
    setEditingField({...editingField, color: color});
    updateFormField(editingField.id, { ...editingField, color: color})
  };

  const handleTitleColorChange = (newHexColor) => {
    setHexColor(newHexColor);
    const rgb = convert.hex.rgb(newHexColor);
    const cmyk = convert.rgb.cmyk(rgb);
    setRgbColor(rgb);
    setCmykColor(cmyk);
    changeTitleColorHandler(newHexColor);
  };
  const handleTitleHexChange = (e) => {
    const hex = e.target.value;
    setHexColor(hex);
    const rgb = convert.hex.rgb(hex);
    const cmyk = convert.hex.cmyk(hex);
    setRgbColor(rgb);
    setCmykColor(cmyk);
    changeTitleColorHandler(hex);
  };
  const handleTitleRgbChange = (e) => {
    const rgb = e.target.value.split(',').map(Number);
    setRgbColor(rgb);
    const hex = convert.rgb.hex(rgb);
    const cmyk = convert.rgb.cmyk(rgb);
    setHexColor('#'+hex);
    setCmykColor(cmyk);
    changeTitleColorHandler('#'+convert.rgb.hex(rgb));
  };
  const handleTitleCmykChange = (e) => {
    const cmyk = e.target.value.split(',').map(Number);
    setCmykColor(cmyk);
    const rgb = convert.cmyk.rgb(cmyk); 
    const hex = convert.cmyk.hex(cmyk);
    setRgbColor(rgb);
    setHexColor('#'+hex);
    changeTitleColorHandler('#'+convert.cmyk.hex(cmyk));
  };
  
  const handleColorChange = (newHexColor, index) => {
    setHexColor(newHexColor);
    const rgb = convert.hex.rgb(newHexColor);
    const cmyk = convert.rgb.cmyk(rgb);
  
    setRgbColor(rgb);
    setCmykColor(cmyk);
  
    changeOptionColorHandler(newHexColor, index);
  };
  const handleHexChange = (e, index) => {
    const hex = e.target.value;
    setHexColor(hex);
    const rgb = convert.hex.rgb(hex);
    const cmyk = convert.hex.cmyk(hex);  
    setRgbColor(rgb);
    setCmykColor(cmyk);
    changeOptionColorHandler(hex, index);
  };
  const handleRgbChange = (e, index) => {
    const rgb = e.target.value.split(',').map(Number);
    setRgbColor(rgb);
    const hex = convert.rgb.hex(rgb);
    const cmyk = convert.rgb.cmyk(rgb);
    setHexColor('#'+hex);
    setCmykColor(cmyk);
    changeOptionColorHandler('#'+convert.rgb.hex(rgb), index);
  };
  const handleCmykChange = (e, index) => {
    const cmyk = e.target.value.split(',').map(Number);
    setCmykColor(cmyk);
    const rgb = convert.cmyk.rgb(cmyk); 
    const hex = convert.cmyk.hex(cmyk);
    setRgbColor(rgb);
    setHexColor('#'+hex);
    changeOptionColorHandler('#'+convert.cmyk.hex(cmyk), index);
  };

  const handleColumnsColorChange = (newHexColor, index, optionIndex) => {
    setHexColor(newHexColor);
    const rgb = convert.hex.rgb(newHexColor);
    const cmyk = convert.rgb.cmyk(rgb);
  
    setRgbColor(rgb);
    setCmykColor(cmyk);
    changeColumnsColorHandler(newHexColor, index, optionIndex);
  };
  const changeColumnsColorHandler = (color, index, optionIndex) => {
    const updatedEditingField = { ...editingField };

    // Navigate to the specific option and update the color
    updatedEditingField.value = updatedEditingField.value.map((section, secIndex) => {
      if (secIndex === index) {
        return {
          ...section,
          options: section.options.map((option, optIndex) => 
            optIndex === optionIndex 
              ? { ...option, color: color } 
              : option
          )
        };
      }
      return section;
    });
    setEditingField(updatedEditingField);
    updateFormField(editingField.id, updatedEditingField)
  };
  const handleColumnsHexChange = (e, index, optionIndex) => {
    const hex = e.target.value;
    setHexColor(hex);
    const rgb = convert.hex.rgb(hex);
    const cmyk = convert.hex.cmyk(hex);  
    setRgbColor(rgb);
    setCmykColor(cmyk);
    changeColumnsColorHandler(hex, index, optionIndex);
  };
  const handleColumnsRgbChange = (e, index, optionIndex) => {
    const rgb = e.target.value.split(',').map(Number);
    setRgbColor(rgb);
    const hex = convert.rgb.hex(rgb);
    const cmyk = convert.rgb.cmyk(rgb);
    setHexColor('#'+hex);
    setCmykColor(cmyk);
    changeColumnsColorHandler('#'+convert.rgb.hex(rgb), index, optionIndex);
  };
  const handleColumnsCmykChange = (e, index, optionIndex) => {
    const cmyk = e.target.value.split(',').map(Number);
    setCmykColor(cmyk);
    const rgb = convert.cmyk.rgb(cmyk); 
    const hex = convert.cmyk.hex(cmyk);
    setRgbColor(rgb);
    setHexColor('#'+hex);
    changeColumnsColorHandler('#'+convert.cmyk.hex(cmyk), index, optionIndex);
  };
  
  // Handler for changing the color of the option
  const changeOptionColorHandler = (color, index, options_index) => {
    setColor(color);
    //console.log('changeOptionColorHandler color index  :', color, index)
    Object.defineProperty(editingField, 'dropdown', {
      get() {
        return this.options;
      },
      set(value) {
        this.options = value;
      }
    });
    const newOptions = editingField.options.map((option, opt_index) => {
      if(opt_index === index){
        option.color = color;
      }
      return option;
    });
    setEditingField({...editingField, options: newOptions});
    updateFormField(editingField.id, { ...editingField, options: newOptions})
  };

  const changeDateFormatHandler = (selectedFormat) => {
    setEditingField({...editingField, dateFormat: selectedFormat})
    updateFormField(editingField.id, { ...editingField, dateFormat: selectedFormat})
  };
  
  const changeTimeFormatHandler = (selectedFormat) => {
    setEditingField({...editingField, timeFormat: selectedFormat})
    updateFormField(editingField.id, { ...editingField, timeFormat: selectedFormat})
  };

  const [showLogic, setShowLogic] = useState(false);
  const [showGeneral, setShowGeneral] = useState(true);
  const [showColumns, setShowColumns] = useState(true);
  const [showSpecific, setShowSpecific] = useState(true);

  const toggleSection = (section) => {
    if (section === 'logic') {
      setShowLogic(!showLogic);
    } else if (section === 'general') {
      setShowGeneral(!showGeneral);
    } else if (section === 'columns') {
      setShowColumns(!showColumns);
    } else if (section === 'specific') {
      setShowSpecific(!showSpecific);
    }
  };

  const handleRemoveClick = (fieldId) => {
    removeFormField(fieldId)
    setEditingField({ id: '' });
  }

  const changeColumnTypeHandler = (type, index) => {
    const updatedValues = [...editingField.value];
  
    let newField = {
      ...updatedValues[index],
      type: type,
    };
  
    // Handle specific types and add default properties
    switch (type) {
      case 'dropdown':
        newField.options = [
          { title: 'Option 1', selected: true },
          { title: 'Option 2', selected: false },
          { title: 'Option 3', selected: false },
        ];
        break;
      case 'name':
        newField.labels = ['First name', 'Last name'];
        break;
      case 'checkbox':
      case 'radio':
        newField.options = [
          { title: 'Option 1', checked: true },
          { title: 'Option 2', checked: false },
          { title: 'Option 3', checked: false },
        ];
        newField.layout = 'vertical';
        break;
      case 'date_time':
        newField.dateFormat = 'MM/DD/YYYY';
        newField.timeFormat = '12';
        newField.value = {
          date: '',
          time: '',
        };
        break;
  
      default:
        newField.options = undefined;
        break;
    }
  
    updatedValues[index] = newField;
  
    console.log('updatedValues : ', updatedValues);

    // Set the updated values back to the field
    setEditingField((prev) => ({
      ...prev,
      value: updatedValues,
    }));
    updateFormField(editingField.id, { ...editingField, value: updatedValues})
  
  };
  
  const handleRemovingColumn = (columnIndex) => {
    const newValue = editingField.value.filter((_, index) => index !== columnIndex);
    const newLabels = editingField.labels.filter((_, index) => index !== columnIndex);
    setEditingField({ ...editingField, value: newValue, labels: newLabels });
    updateFormField(editingField.id, { ...editingField, value: newValue, labels: newLabels })
  };
  const handleAddingNewColumn = () => {
    const newValue = [...editingField.value, {
      type: 'short_answer',
      value: ''
    }]
    const newLabels = [...editingField.labels, 'label']
    setEditingField({...editingField, value: newValue, labels: newLabels});
    updateFormField(editingField.id, { ...editingField, value: newValue, labels: newLabels })
  }


  const handleTypeChange = (type) => {
    let newComponent = {
      type: type,
      value: '',
    };
  
    switch (type) {
      case 'dropdown':
        newComponent = {
          ...newComponent,
          options: [
            { title: 'Option 1', selected: true },
            { title: 'Option 2', selected: false },
            { title: 'Option 3', selected: false },
          ],
        };
        break;
      
      case 'name':
        newComponent = {
          ...newComponent,
          labels: ['First name', 'Last name'],
        };
        break;
  
      case 'radio':
        newComponent = {
          ...newComponent,
          options: [
            { title: 'Option 1', checked: true },
            { title: 'Option 2', checked: false },
            { title: 'Option 3', checked: false },
          ],
          layout: 'vertical',
        };
        break;
  
      case 'checkbox':
        newComponent = {
          ...newComponent,
          options: [
            { title: 'Option 1', checked: true },
            { title: 'Option 2', checked: false },
            { title: 'Option 3', checked: false },
          ],
          layout: 'vertical',
        };
        break;
  
      case 'date_time':
        newComponent = {
          ...newComponent,
          dateFormat: 'MM/DD/YYYY',
          timeFormat: '12',
          value: {
            date: '',
            time: '',
          },
        };
        break;
  
      default:
        break;
    }
  
    setEditingField((prev) => ({
      ...prev,
      adding_component: newComponent,
    }));
    updateFormField(editingField.id, { ...editingField, adding_component: newComponent})
  };
  
  const dateFormatOptions=  [
    { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
    { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
    { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
  ]
  const timeFormatOptions=  [
    { label: '12 Hour', value: '12' },
    { label: '24 Hour', value: '24' },
  ]

  const { fieldEditorRef } = useContext(OutsideClickContext);

  return (
    <div className="field-editor" ref={fieldEditorRef}>
    { editingField && editingField.id !== '' ?
    <>
      <div className='field-editor-container'>
        <div className="field-editor__header">
          {titles_to_types_object[editingField.type]}
          <div className="field-editor__actions">
            <button className="field-editor-remove-field" id="remove_icon" help-title="remove" 
            onClick={() => handleRemoveClick(editingField.id)}>
              <img src={trash_icon} className="remove-icon"/>
            </button>
            <button className="field-editor-remove-field" id="duplicate_icon" help-title="duplicate" 
            onClick={() => duplicateField(editingField.id)}>
              <img src={duplicate_icon} className="remove-icon"/>
            </button>
            <button className="field-editor-remove-field" id="save_icon" help-title="save" 
            onClick={setIsCustomFieldSavingWindow}>
              <img src={save_icon} className="size18-icon"/>
            </button>
          </div>
        </div>
      </div>
      {/* <div className="section-group">
        <div className="field-editor__section">
          <div className="section-header" onClick={() => toggleSection('logic')}>
            <span className={`toggle-icon ${showLogic ? 'open' : 'closed'}`}>&#9660;</span>
            <h3>Logic</h3>
          </div>
        </div>
      </div> */}
      <div className="section-group">
        <div className="field-editor__section">
          <div className="section-header" onClick={() => toggleSection('general')}>
            <span className={`toggle-icon ${showGeneral ? 'open' : 'closed'}`}>&#9660;</span>
            General
          </div>
          {showGeneral && (
            <div className="option-content">
              <div className="field-editor__field">
                <label className="field-editor__label">FIELD LABEL</label>
                <input type="text" value={editingField.title} onChange={e => changeFieldTitleHandler(e)} className="field-editor__input" />
              </div>
              {
                (editingField.type === 'double_section' || editingField.type === 'triple_section' 
                  || editingField.type === 'two_inputs_section' || editingField.type === 'triple_inputs_section'
                  || editingField.type === 'four_inputs_section' || editingField.type === 'five_inputs_section'
                || editingField.type === 'multi_section') 
                && (
                  <>
                    {editingField.labels.map((label, index) => (
                      <div key={index} className="field-editor__field">
                        <label className="field-editor__label">{`${ordinalArray[index]} label`}</label>
                        <input
                          type="text"
                          value={label}
                          onChange={e => changeFieldLabelHandler(e, index)}
                          className="field-editor__input"
                        />
                      </div>
                    ))}
                  </>
                )
              }
              {
                editingField.type === 'add_component_button' && (
                  <div className="option-content">
                    <div className="option-group">
                      <label>Select component to add:</label>
                      <ComponentTypeSelector selectedType={editingField.adding_component.type} onChange={handleTypeChange} />
                    </div>
                  </div>
                )
              }
              {
                editingField.type !== 'title' && editingField.type !== 'columns' &&
                <div className="field-editor_checkbox-group">
                  <div className='field-editor_checkbox_container'>
                    <label htmlFor="required" className="field-editor-label">
                      <input type="checkbox" id="required" className='field-editor_checkbox' 
                      checked={editingField.required} onChange={changeFieldRequiredHandler}/>
                      Required
                    </label>
                  </div>
                  <div className='field-editor_checkbox_container'>
                    <label className="field-editor-label">
                      <input type="checkbox" id="read-only" className='field-editor_checkbox' 
                      checked={editingField.read_only} onChange={changeFieldReadOnlyHandler}/>
                      <label htmlFor="read-only">Read-only</label>
                    </label>
                  </div>
                  {/* <div className='field-editor_checkbox_container'>
                    <label className="field-editor-label">
                      <input type="checkbox" id="hide-label" className='field-editor_checkbox' />
                      <label htmlFor="hide-label">Hide Label</label>
                    </label>
                  </div> */}
                </div>
              }
              {
                editingField.type === 'columns' &&
                <div className="field-editor__field">
                  <label className="field-editor__label">COLUMNS STYLE</label>
                  <div className='field-editor_checkbox_container'>
                    <label htmlFor="column_style" className="field-editor-label">
                      <input type="checkbox" id="column_style" className='field-editor_checkbox' 
                      checked={editingField.style === 'tabular'} onChange={changeColumnsStyleHandler}/>
                      Tabular
                    </label>
                  </div>
                </div>
              }
            </div>)
            }
        </div>
      </div>
      {
        editingField.type === 'columns' &&
        <div className="section-group">
          <div className="field-editor__section">
            <div className="section-header" onClick={() => toggleSection('columns')}>
              <span className={`toggle-icon ${showColumns ? 'open' : 'closed'}`}>&#9660;</span>
              Columns' Settings
            </div>
            {showColumns && (
              <>
              <div className="option-content">
                {
                  editingField.type === 'columns'
                  && (
                    <>
                      {editingField.labels.map((label, index) => (
                        <div key={index} className="field-editor__field">
                          <label className="field-editor__label">{`${ordinalArray[index]} label`}</label>
                          <div className="field-editor-column">
                            <input
                              type="text"
                              value={label}
                              onChange={e => changeFieldLabelHandler(e, index)}
                              className="field-editor__input"
                            />
                            <button className="field-editor-remove-button" onClick={() => handleRemovingColumn(index)}>
                              -
                            </button>
                          </div>
                          <label className="field-editor__label">Column`s type: </label>
                          <div className="field-editor-column">
                            <ColumnsTypeSelector selectedType={editingField.value[index].type} index={index} onChange={changeColumnTypeHandler} />
                          </div>
                          <div className="field-editor_checkbox-group">
                            <div className='field-editor_checkbox_container'>
                              <label htmlFor="required" className="field-editor-label">
                                <input type="checkbox" id="required" className='field-editor_checkbox' 
                                checked={editingField.value[index].required} onChange={changeFieldRequiredHandler}/>
                                Required
                              </label>
                            </div>
                            { readonly_types_array.includes(editingField.value[index].type) &&
                              <div className='field-editor_checkbox_container'>
                                <label className="field-editor-label">
                                  <input type="checkbox" id="read-only" className='field-editor_checkbox' 
                                  checked={editingField.value[index].read_only} onChange={() => changeFieldReadOnlyHandlerInColumn(index)}/>
                                  <label htmlFor="read-only">Read-only</label>
                                </label>
                              </div>
                            }
                          </div>
                        </div>
                      ))}
                    </>
                  )
                }
                {
                  editingField.type !== 'title' &&  editingField.type !== 'columns' &&
                  <div className="field-editor_checkbox-group">
                    <div className='field-editor_checkbox_container'>
                      <label htmlFor="required" className="field-editor-label">
                        <input type="checkbox" id="required" className='field-editor_checkbox' 
                        checked={editingField.required} onChange={changeFieldRequiredHandler}/>
                        Required
                      </label>
                    </div>
                    <div className='field-editor_checkbox_container'>
                      <label className="field-editor-label">
                        <input type="checkbox" id="read-only" className='field-editor_checkbox' 
                        checked={editingField.read_only} onChange={changeFieldReadOnlyHandler}/>
                        <label htmlFor="read-only">Read-only</label>
                      </label>
                    </div>
                  </div>
                }
                <div className="field-editor-add-column" onClick={() => handleAddingNewColumn()}>
                  <img src={plus_icon} />
                  Add new column
                </div> 
              </div>
              </>
              )
            }
          </div>
        </div>
      }
      <div className="section-group">
      <div className="field-editor__section">
        <div className="section-header" onClick={() => toggleSection('specific')}>
          <span className={`toggle-icon ${showSpecific ? 'open' : 'closed'}`}>&#9660;</span>
          Field-Specific
        </div>
        {showSpecific ? 
          <>
          {(editingField.type === 'short_answer' || editingField.type === 'long_answer') && 
            <div className="option-content">
              <div className="option-group">
                <label>Pre-filled value</label>
                <div className="option-input">
                  <input type="text" onChange={(e) => changeFieldPreFilledHandler(e)} value={editingField.value}/>
                </div>
              </div>
            </div>
          }
          {editingField.type === 'title' && 
            <div className="option-content">
              <div className="option-group">
                <label>Background Color : </label>
                <div className="color-picker-container">
                  <div
                    className="color-preview"
                    onClick={() => toggleColorPicker(1)}
                    style={ !color ? {backgroundColor: '#FFFFFF'} : color.includes('rgba') ? 
                    {backgroundColor: '#FFFFFF'} : {backgroundColor: color}}
                  />
                  { (color && hexColor && rgbColor && cmykColor) && colorPickerVisible && (
                    <div className="color-preview-container">
                      <HexColorPicker  color={color} onChange={handleTitleColorChange} />
                      <div className="color-format-inputs">
                        <div className="rgb-input-container">
                          <label htmlFor="rgb-input">HEX</label>
                          <input
                            type="text"
                            className="color-preview-input"
                            value={hexColor}
                            onChange={handleTitleHexChange}
                            placeholder="HEX"
                          />
                        </div>
                        <div className="rgb-input-container">
                          <label htmlFor="rgb-input">RGB</label>
                          <input
                            type="text"
                            className="color-preview-input"
                            value={rgbColor.join(',')}
                            onChange={handleTitleRgbChange}
                            placeholder="RGB (r,g,b)"
                          />
                        </div>
                        <div className="rgb-input-container">
                          <label htmlFor="rgb-input">CMYK</label>
                          <input
                            type="text"
                            className="color-preview-input"
                            value={cmykColor.join(',')}
                            onChange={handleTitleCmykChange}
                            placeholder="CMYK (c,m,y,k)"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          }
          { editingField.type === 'checkbox' && 
            <div className="option-content">
              <div className="option-group">
                <label>OPTIONS</label>
                  {editingField.options.map((option, optionIndex)=> (
                    <div key={optionIndex} className="option-input">
                      <input type="text" onChange={(e) => changeFieldBoxOptionHandler(e, optionIndex)} value={option.title}/>
                      <div className="option-buttons">
                        <button className="field-editor-add-button" onClick={() => addFieldBoxOptionHandler(optionIndex)}>+</button>
                        <button className="field-editor-remove-button" onClick={() => deleteFieldBoxOptionHandler(optionIndex)}>-</button>
                      </div>
                      {
                        option.correctiveAction && option.correctiveAction.text ?
                        <>
                          <div className="field-editor-option-corrective-action">
                            Corrective action: {option.correctiveAction.text}
                            <button className="field-editor-option-corrective-action-remove" 
                            onClick={() => chooseOptionToRemoveCorrectiveAction(editingField.id, "", optionIndex)}>-</button>
                          </div>
                        </>
                        :
                        <div className="field-editor-add-corrective-action-button" 
                        onClick={() => chooseOptionToAddCorrectiveAction(editingField.id, "", optionIndex)}>
                          {/* <img className='size20-icon' src={add_corrective_action_icon} alt='+'/> */}
                          Add corrective action
                        </div>
                      }
                    </div>
                  ))}
              </div>
              <div className="layout-group">
                <label>LAYOUT</label>
                <div className="field-editor-radio-group">
                  <label>
                    <input type="radio" name="layout" value="vertical" 
                    onChange={changeFieldBoxLayoutHandler} checked={editingField.layout === 'vertical'} />
                    Vertical
                  </label>
                  <label>
                    <input type="radio" name="layout" value="horizontal" 
                    onChange={changeFieldBoxLayoutHandler} checked={editingField.layout === 'horizontal'}/>
                    Horizontal
                  </label>
                </div>
              </div>
              {/* <div className="default-value-group">
                <label>DEFAULT VALUE</label>
                <input type="text" />
              </div> */}
            </div>
          }
          { editingField.type === 'radio' && 
            <div className="option-content">
              <div className="option-group">
                <label>OPTIONS</label>
                  {editingField.options.map((option, optionIndex)=> (
                    <div key={optionIndex} className="option-input">
                      <input type="text" onChange={(e) => changeFieldBoxOptionHandler(e, optionIndex)} value={option.title}/>
                      <div className="option-buttons">
                        <button className="field-editor-add-button" onClick={() => addFieldBoxOptionHandler(optionIndex)}>+</button>
                        <button className="field-editor-remove-button" onClick={() => deleteFieldBoxOptionHandler(optionIndex)}>-</button>
                      </div>
                      {
                        option.correctiveAction && option.correctiveAction.text ?
                        <>
                          <div className="field-editor-option-corrective-action">
                            Corrective action: {option.correctiveAction.text}
                            <button className="field-editor-option-corrective-action-remove" 
                            onClick={() => chooseOptionToRemoveCorrectiveAction(editingField.id, '', optionIndex)}>-</button>
                          </div>
                        </>
                        :
                        <div className="field-editor-add-corrective-action-button" 
                        onClick={() => chooseOptionToAddCorrectiveAction(editingField.id, '', optionIndex)}>
                          {/* <img className='size20-icon' src={add_corrective_action_icon} alt='+'/> */}
                          Add corrective action
                        </div>
                      }
                    </div>
                  ))}
              </div>
              <div className="layout-group">
                <label>LAYOUT</label>
                <div className="field-editor-radio-group">
                  <label>
                    <input type="radio" name="layout" value="vertical" 
                    onChange={changeFieldBoxLayoutHandler} checked={editingField.layout === 'vertical'} />
                    Vertical
                  </label>
                  <label>
                    <input type="radio" name="layout" value="horizontal" 
                    onChange={changeFieldBoxLayoutHandler} checked={editingField.layout === 'horizontal'}/>
                    Horizontal
                  </label>
                </div>
              </div>
            </div>
          }
          { editingField.type === 'date_time' && 
            <div className="option-content">
              <div className="option-group">
                <label>Date Format</label>
                <select
                  value={editingField.dateFormat}
                  onChange={changeDateFormatHandler}
                >
                  <option value="MMM D, YYYY">MMM D, YYYY</option>
                  <option value="D/M/YYYY">D/M/YYYY</option>
                  <option value="DD.MM.YYYY">DD.MM.YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            
              <div className="option-group">
                <label>Time Format</label>
                <select
                  value={editingField.timeFormat}
                  onChange={changeTimeFormatHandler}
                >
                  <option value="h:mm A">12 Hour (h:mm A)</option>
                  <option value="HH:mm">24 Hour (HH:mm)</option>
                </select>
              </div>
            </div>
          }
          {editingField.type === 'dropdown' && 
          <DropdownOptions editingField={editingField} changeListOptionHandler={changeFieldListOptionHandler} 
          handleColorChange={handleColorChange} toggleColorPicker={toggleColorPicker}
          colorPickerVisible={colorPickerVisible} hexColor={hexColor} rgbColor={rgbColor} cmykColor={cmykColor}
          handleRgbChange={handleRgbChange} handleHexChange={handleHexChange} handleCmykChange={handleCmykChange}
          addListOptionHandler={addFieldListOptionHandler} deleteListOptionHandler={deleteFieldListOptionHandler}
          handleOptionsSaving={handleOptionsSaving} chooseOptionsToChange={chooseOptionsToChange} 
          chooseOptionToAddCorrectiveAction={chooseOptionToAddCorrectiveAction}
          chooseOptionToRemoveCorrectiveAction={chooseOptionToRemoveCorrectiveAction}/>
          }
          <LegacyComponentsOptions editingField={editingField} changeFieldListOptionHandler={changeFieldListOptionHandler} 
          addFieldListOptionHandlerNew={addListOptionHandlerInColumns} deleteFieldListOptionHandlerNew={deleteListOptionHandlerInColumns}
          changeSectionFieldPreFilledHandler={changeSectionFieldPreFilledHandler}/>
          {
            editingField.type === 'columns' && (
              <div className="option-content">
                {
                  editingField.value.map((value, index) => (
                    ( value.type === 'short_answer' || value.type === 'long_answer' ||
                      value.type === 'address' || value.type === 'email' || value.type === 'number' 
                    ) ?
                    <div key={index} className="option-group">
                      <label>Pre-filled value for {editingField.labels[index]}</label>
                      <div className="option-input">
                        <input type="text" onChange={(e) => changeColumnFieldPreFilledHandler(e, index)} value={value.value}/>
                      </div>
                    </div>
                    : value.type === 'dropdown' ?
                    <div key={index} className="option-group">
                      <label>
                        OPTIONS for {editingField.labels[index]} 
                        <div className="option-group-features">
                          <div className='choose-option-button' onClick={() => chooseOptionsToChange(editingField.id, index)}>
                            <img className="option-group-img" src={chooser_options_icon} alt='choose'/>
                          </div>
                          <img className="option-group-img" src={save_icon} 
                          onClick={()=> handleOptionsSaving(value.options)} alt='save'/>
                        </div>
                      </label>
                      {value.options.length !== 0 ? value.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="option-input">
                          <input
                            type="text"
                            onChange={(e) => changeListOptionHandlerInColumns(e, optionIndex, index)}
                            value={option.title}
                          />
                          <div className="option-buttons">
                            <div className="color-picker-container">
                              <div
                                className="color-preview"
                                onClick={() => toggleColorPicker(index+'_'+optionIndex, option.color || '#FFFFFF')}
                                style={ !option.color ? {backgroundColor: '#FFFFFF'} : option.color.includes('rgba') ? 
                                {backgroundColor: '#FFFFFF'} : {backgroundColor: option.color}}
                              />
                              { (hexColor && rgbColor && cmykColor) && colorPickerVisible === index+'_'+optionIndex && (
                                <div className="color-preview-container">
                                  <HexColorPicker  color={option.color} onChange={(color) => handleColumnsColorChange(color, index, optionIndex)} />
                                  <div className="color-format-inputs">
                                    <div className="rgb-input-container">
                                      <label htmlFor="rgb-input">HEX</label>
                                      <input
                                        type="text"
                                        className="color-preview-input"
                                        value={hexColor}
                                        onChange={e => handleColumnsHexChange(e, index, optionIndex)}
                                        placeholder="HEX"
                                      />
                                    </div>
                                    <div className="rgb-input-container">
                                      <label htmlFor="rgb-input">RGB</label>
                                      <input
                                        type="text"
                                        className="color-preview-input"
                                        value={rgbColor.join(',')}
                                        onChange={e => handleColumnsRgbChange(e, index, optionIndex)}
                                        placeholder="RGB (r,g,b)"
                                      />
                                    </div>
                                    <div className="rgb-input-container">
                                      <label htmlFor="rgb-input">CMYK</label>
                                      <input
                                        type="text"
                                        className="color-preview-input"
                                        value={cmykColor.join(',')}
                                        onChange={e => handleColumnsCmykChange(e, index, optionIndex)}
                                        placeholder="CMYK (c,m,y,k)"
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <button
                              className="field-editor-add-button"
                              onClick={() => addListOptionHandlerInColumns(optionIndex, index)}
                            >
                              +
                            </button>
                            <button
                              className="field-editor-remove-button"
                              onClick={() => deleteListOptionHandlerInColumns(optionIndex, index)}
                            >
                              -
                            </button>
                          </div>
                          {
                            option.correctiveAction && option.correctiveAction.text ?
                            <>
                              <div className="field-editor-option-corrective-action">
                                Corrective action: {option.correctiveAction.text}
                                <button className="field-editor-option-corrective-action-remove" 
                                onClick={() => chooseOptionToRemoveCorrectiveAction(editingField.id, index, optionIndex)}>-</button>
                              </div>
                            </>
                            :
                            <div className="field-editor-add-corrective-action-button" 
                            onClick={() => chooseOptionToAddCorrectiveAction(editingField.id, index, optionIndex)}>
                              {/* <img className='size20-icon' src={add_corrective_action_icon} alt='+'/> */}
                              Add corrective action
                            </div>
                          }
                        </div>
                      ))
                      :
                      <button
                        className="field-editor-add-first-option-button"
                        onClick={() => addListOptionHandlerInColumns(0, index)}
                      >
                        Add new option
                      </button>
                    }
                    </div>
                    :
                    (value.type === 'checkbox' || value.type === 'radio') ?
                      <div className="column-option-content">
                        <div className="option-group">
                          <label>OPTIONS for {editingField.labels[index]} </label>
                            {value.options?.map((option, optionIndex)=> (
                              <>
                              <div key={optionIndex} className="option-input">
                                <input type="text" onChange={(e) => changeBoxOptionHandlerInColumns(e, optionIndex, index)} value={option.title}/>
                                <div className="option-buttons">
                                  <button className="field-editor-add-button" onClick={() => addBoxOptionHandlerInColumns(optionIndex, index)}>+</button>
                                  <button className="field-editor-remove-button" onClick={() => deleteBoxOptionHandlerInColumns(optionIndex, index)}>-</button>
                                </div>
                                {
                                  option.correctiveAction && option.correctiveAction.text ?
                                  <>
                                    <div className="field-editor-option-corrective-action">
                                      Corrective action: {option.correctiveAction.text}
                                      <button className="field-editor-option-corrective-action-remove" 
                                      onClick={() => chooseOptionToRemoveCorrectiveAction(editingField.id, index, optionIndex)}>-</button>
                                    </div>
                                  </>
                                  :
                                  <div className="field-editor-add-corrective-action-button" 
                                  onClick={() => chooseOptionToAddCorrectiveAction(editingField.id, index, optionIndex)}>
                                    {/* <img className='size20-icon' src={add_corrective_action_icon} alt='+'/> */}
                                    Add corrective action
                                  </div>
                                }
                              </div>
                              </>
                            ))}
                        </div>
                        <div className="layout-group">
                          <label>LAYOUT for {editingField.labels[index]}</label>
                          <div className="field-editor-radio-group">
                            <label>
                              <input type="radio" name={`${index}_layout`} value="vertical" 
                              onChange={(e) => changeBoxLayoutHandlerInColumns(e, index)} checked={value.layout === 'vertical'} />
                              Vertical
                            </label>
                            <label>
                              <input type="radio" name={`${index}_layout`} value="horizontal" 
                              onChange={(e) => changeBoxLayoutHandlerInColumns(e, index)} checked={value.layout === 'horizontal'}/>
                              Horizontal
                            </label>
                          </div>
                        </div>
                      </div>
                    :
                    value.type === 'date_time' ?
                      <div className="column-option-content">
                        <div className="option-group">
                          <label>Date Format for {editingField.labels[index]} </label>
                          <select
                            value={value.dateFormat}
                            onChange={changeDateFormatHandler}
                          >
                            <option value="MMM D, YYYY">MMM D, YYYY</option>
                            <option value="D/M/YYYY">D/M/YYYY</option>
                            <option value="DD.MM.YYYY">DD.MM.YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                          </select>
                        </div>
                      
                        <div className="option-group">
                          <label>Time Format</label>
                          <select
                            value={value.timeFormat}
                            onChange={changeTimeFormatHandler}
                          >
                            <option value="h:mm A">12 Hour (h:mm A)</option>
                            <option value="HH:mm">24 Hour (HH:mm)</option>
                          </select>
                        </div>
                      </div>
                    : <></>
                  ))
                }
              </div>
            )
          }
          {
            editingField.type === 'add_component_button' && (
              <div></div>
            )
          }
          </>
          :
          <></>
        }
      </div>
    </div>
    </>
    : <></>
    }
    </div>
  );
};

export default FieldBuilderEditor;