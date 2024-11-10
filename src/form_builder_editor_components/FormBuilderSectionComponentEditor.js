import { useContext, useEffect, useState } from 'react';
import '../FormBuilderEditor.css';
import { OutsideClickContext } from '../OutsideClickContext';
import { titles_to_types_object } from '../consts';
import trash_icon from '../icons/trash-can.svg'
import plus_icon from '../icons/plus-icon.svg';
import save_icon from '../icons/save-icon.svg';
import chooser_options_icon from '../icons/chooser-options.svg'
import duplicate_icon from '../icons/duplicate-icon.svg'
import { HexColorPicker  } from "react-colorful";
import convert from "color-convert"; 
import ComponentTypeSelector from '../ComponentTypeSelector';
import DropdownOptions from '../form_builder_editor_components/DropdownOptions';

const FormBuilderSectionComponentEditor = ({removeFormSectionField, duplicateField, editingField, setEditingField,
  editingSectionField, setEditingSectionField,  handleDuplicateClick, handleOptionsSaving,
  chooseOptionsToChange}) => {

  const changeFieldTitleHandler = (e) => {
    const updatedComponents = editingField.components.map((field) => {
      if (field.id === editingSectionField.id) {
        return {
          ...field,
          title: e.target.value,
        };
      }
      return field;
    });
    setEditingSectionField({...editingSectionField, title: e.target.value})
    setEditingField({...editingField, components: updatedComponents})
  }
  const changeFieldLabelHandler = (e, index) => {
    const updatedComponents = editingField.components.map((field) => {
      if (field.id === editingSectionField.id) {
        const updatedLabels = [...field.labels];
        updatedLabels[index] = e.target.value;
        return { ...field, labels: updatedLabels };
      }
      return field;
    });
  
    setEditingSectionField({
      ...editingSectionField,
      labels: updatedComponents.find((field) => field.id === editingSectionField.id)?.labels || [],
    });
    setEditingField({ ...editingField, components: updatedComponents });
  };
  
  const changeFieldRequiredHandler = () => {
    const updatedComponents = editingField.components.map((field) => {
      if (field.id === editingSectionField.id) {
        return { ...field, required: !field.required };
      }
      return field;
    });
  
    setEditingSectionField({...editingSectionField, required: !editingSectionField.required});
    setEditingField({ ...editingField, components: updatedComponents });
  };
  
  // Toggle the 'read_only' property on the specific component
  const changeFieldReadOnlyHandler = () => {
    const updatedComponents = editingField.components.map((field) => {
      if (field.id === editingSectionField.id) {
        return { ...field, read_only: !field.read_only };
      }
      return field;
    });
  
    setEditingSectionField({...editingSectionField, read_only: !editingSectionField.read_only});
    setEditingField({ ...editingField, components: updatedComponents });
  };
  
  // Change the pre-filled value on the specific component
  const changeFieldPreFilledHandler = (e) => {
    const updatedComponents = editingField.components.map((field) => {
      if (field.id === editingSectionField.id) {
        return { ...field, value: e.target.value };
      }
      return field;
    });
  
    setEditingSectionField({ ...editingSectionField, value: e.target.value});
    setEditingField({ ...editingField, components: updatedComponents });
  };
  
  const changeColumnFieldPreFilledHandler = (e, columnIndex) => {
    const updatedComponents = editingField.components.map((field) => {
      if (field.id === editingSectionField.id) {
        const newValue = [...field.value];
        newValue[columnIndex].value = e.target.value;
        return { ...field, value: newValue };
      }
      return field;
    });
  
    setEditingSectionField({
      ...editingSectionField,
      value: updatedComponents.find((field) => field.id === editingSectionField.id)?.value || [],
    });
    setEditingField({ ...editingField, components: updatedComponents });
  };
  const changeColumnsStyleHandler = (e) => {
    let newStyle = 'tabular'
    if(editingSectionField.style && editingSectionField.style === 'tabular'){
      newStyle = ''
    }
  
    const updatedComponents = editingField.components.map((field) => {
      if (field.id === editingSectionField.id) {
        return { ...field, style: newStyle };
      }
      return field;
    });
    setEditingSectionField({...editingSectionField, style: newStyle,});
    setEditingField({ ...editingField, components: updatedComponents });
  }  
  
  // Add a checkbox option at a specific index within a component
  const addFieldCheckOptionHandler = (index) => {
    const updatedComponents = editingField.components.map((field) => {
      if (field.id === editingSectionField.id) {
        const newCheckboxes = [
          ...field.checkbox.slice(0, index + 1),
          { title: 'Option', checked: false },
          ...field.checkbox.slice(index + 1),
        ];
        return { ...field, checkbox: newCheckboxes };
      }
      return field;
    });
  
    setEditingSectionField({
      ...editingSectionField,
      checkbox: updatedComponents.find((field) => field.id === editingSectionField.id)?.checkbox || [],
    });
    setEditingField({ ...editingField, components: updatedComponents });
  };
  
  // Delete a checkbox option at a specific index within a component
  const deleteFieldCheckOptionHandler = (index) => {
    const updatedComponents = editingField.components.map((field) => {
      if (field.id === editingSectionField.id) {
        const newCheckboxes = [
          ...field.checkbox.slice(0, index),
          ...field.checkbox.slice(index + 1),
        ];
        return { ...field, checkbox: newCheckboxes };
      }
      return field;
    });
  
    setEditingSectionField({
      ...editingSectionField,
      checkbox: updatedComponents.find((field) => field.id === editingSectionField.id)?.checkbox || [],
    });
    setEditingField({ ...editingField, components: updatedComponents });
  };

  // Update a checkbox option's title at a specific index within editingField
  const changeFieldCheckOptionHandler = (e, index) => {
    const updatedComponents = editingField.components.map((field) => {
      if (field.id === editingSectionField.id) {
        const newCheckboxes = field.checkbox.map((option, opt_index) => 
          opt_index === index ? { ...option, title: e.target.value } : option
        );
        return { ...field, checkbox: newCheckboxes };
      }
      return field;
    });

    setEditingSectionField({
      ...editingSectionField,
      checkbox: updatedComponents.find((field) => field.id === editingSectionField.id)?.checkbox || [],
    });
    setEditingField({ ...editingField, components: updatedComponents });
  };

  // Update the layout for checkboxes within editingField
  const changeFieldCheckboxLayoutHandler = (e) => {
    const updatedComponents = editingField.components.map((field) => 
      field.id === editingSectionField.id ? { ...field, layout: e.target.value } : field
    );

    setEditingSectionField({
      ...editingSectionField,
      layout: e.target.value,
    });
    setEditingField({ ...editingField, components: updatedComponents });
  };

  // Add a new radio option at a specific index within editingField
  const addFieldRadioOptionHandler = (index) => {
    const updatedComponents = editingField.components.map((field) => {
      if (field.id === editingSectionField.id) {
        const newRadio = [
          ...field.radio.slice(0, index + 1),
          { title: 'Option', checked: false },
          ...field.radio.slice(index + 1),
        ];
        return { ...field, radio: newRadio };
      }
      return field;
    });

    setEditingSectionField({
      ...editingSectionField,
      radio: updatedComponents.find((field) => field.id === editingSectionField.id)?.radio || [],
    });
    setEditingField({ ...editingField, components: updatedComponents });
  };

  // Delete a radio option at a specific index within editingField
  const deleteFieldRadioOptionHandler = (index) => {
    const updatedComponents = editingField.components.map((field) => {
      if (field.id === editingSectionField.id) {
        const newRadio = [
          ...field.radio.slice(0, index),
          ...field.radio.slice(index + 1),
        ];
        return { ...field, radio: newRadio };
      }
      return field;
    });

    setEditingSectionField({
      ...editingSectionField,
      radio: updatedComponents.find((field) => field.id === editingSectionField.id)?.radio || [],
    });
    setEditingField({ ...editingField, components: updatedComponents });
  };

  // Update a radio option's title at a specific index within editingField
  const changeFieldRadioOptionHandler = (e, index) => {
    const updatedComponents = editingField.components.map((field) => {
      if (field.id === editingSectionField.id) {
        const newRadio = field.radio.map((option, opt_index) => 
          opt_index === index ? { ...option, title: e.target.value } : option
        );
        return { ...field, radio: newRadio };
      }
      return field;
    });

    setEditingSectionField({
      ...editingSectionField,
      radio: updatedComponents.find((field) => field.id === editingSectionField.id)?.radio || [],
    });
    setEditingField({ ...editingField, components: updatedComponents });
  };

  // Update the layout for radio options within editingField
  const changeFieldRadioLayoutHandler = (e) => {
    const updatedComponents = editingField.components.map((field) => 
      field.id === editingSectionField.id ? { ...field, layout: e.target.value } : field
    );

    setEditingSectionField({
      ...editingSectionField,
      layout: e.target.value,
    });
    setEditingField({ ...editingField, components: updatedComponents });
  };

  const addFieldListOptionHandler = (index) => {
    const updatedComponents = editingField.components.map((field) => {
      if (field.id === editingSectionField.id) {
        const newOptions = [
          ...field.dropdown.slice(0, index + 1),
          { title: 'Option', checked: false },
          ...field.dropdown.slice(index + 1)
        ];
        return { ...field, dropdown: newOptions };
      }
      return field;
    });

    setEditingSectionField({
      ...editingSectionField,
      dropdown: updatedComponents.find((field) => field.id === editingSectionField.id)?.dropdown || [],
    });
    setEditingField({ ...editingField, components: updatedComponents });
  };

  // Delete a dropdown option at a specific index within editingField
  const deleteFieldListOptionHandler = (index) => {
    const updatedComponents = editingField.components.map((field) => {
      if (field.id === editingSectionField.id) {
        const newOptions = [
          ...field.dropdown.slice(0, index),
          ...field.dropdown.slice(index + 1)
        ];
        return { ...field, dropdown: newOptions };
      }
      return field;
    });

    setEditingSectionField({
      ...editingSectionField,
      dropdown: updatedComponents.find((field) => field.id === editingSectionField.id)?.dropdown || [],
    });
    setEditingField({ ...editingField, components: updatedComponents });
  };

  // Add a new option in a list inside a specific section
  const addFieldListOptionHandlerNew = (index, sectionIndex) => {
    const updatedComponents = editingField.components.map((field) => {
      if (field.id === editingSectionField.id) {
        const newOptions = [
          ...field.value[sectionIndex].options.slice(0, index + 1),
          { title: 'Option', selected: false },
          ...field.value[sectionIndex].options.slice(index + 1)
        ];
        const newValue = [...field.value];
        newValue[sectionIndex].options = newOptions;
        return { ...field, value: newValue };
      }
      return field;
    });

    setEditingSectionField({
      ...editingSectionField,
      value: updatedComponents.find((field) => field.id === editingSectionField.id)?.value || [],
    });
    setEditingField({ ...editingField, components: updatedComponents });
  };

  // Delete an option in a list inside a specific section
  const deleteFieldListOptionHandlerNew = (index, sectionIndex) => {
    const updatedComponents = editingField.components.map((field) => {
      if (field.id === editingSectionField.id) {
        const newOptions = [
          ...field.value[sectionIndex].options.slice(0, index),
          ...field.value[sectionIndex].options.slice(index + 1)
        ];
        const newValue = [...field.value];
        newValue[sectionIndex].options = newOptions;
        return { ...field, value: newValue };
      }
      return field;
    });

    setEditingSectionField({
      ...editingSectionField,
      value: updatedComponents.find((field) => field.id === editingSectionField.id)?.value || [],
    });
    setEditingField({ ...editingField, components: updatedComponents });
  };

  // Update the title of a list option in a specific section
  const changeFieldListOptionHandlerInColumns = (e, index, sectionIndex) => {
    const updatedComponents = editingField.components.map((field) => {
      if (field.id === editingSectionField.id) {
        if(field.type !== 'dropdown'){
          const newOptions = field.value[sectionIndex].options.map((option, opt_index) => 
            opt_index === index ? { ...option, title: e.target.value } : option
          );
          const newValue = [...field.value];
          newValue[sectionIndex].options = newOptions;
          return { ...field, value: newValue };
        }else{
          const newOptions = editingSectionField.dropdown.map((option, opt_index) => {
            if(opt_index === index){
              option.title = e.target.value
              return option
            }else{
              return option
            }
          })
          const newValue = [...field.value];
          newValue[sectionIndex].dropdown = newOptions;
          return { ...field, dropdown: newValue };
        }
      }
      return field;
    });

    setEditingSectionField({
      ...editingSectionField,
      value: updatedComponents.find((field) => field.id === editingSectionField.id)?.value || [],
    });
    setEditingField({ ...editingField, components: updatedComponents });
  };
  const changeFieldListOptionHandler = (e, index, sectionIndex) => {
    const updatedComponents = editingField.components.map((field) => {
      if (field.id === editingSectionField.id) {
        const newOptions = field.dropdown.map((option, opt_index) => 
          opt_index === index ? { ...option, title: e.target.value } : option
        );
        return { ...field, dropdown: newOptions };
      }
      return field;
    });

    setEditingSectionField({
      ...editingSectionField,
      dropdown: updatedComponents.find((field) => field.id === editingSectionField.id)?.dropdown || [],
    });
    setEditingField({ ...editingField, components: updatedComponents });
  };

  
  const [colorPickerVisible, setColorPickerVisible] = useState(null);
  const [color, setColor] = useState(editingSectionField.color); //міу

  const [hexColor, setHexColor] = useState();
  const [rgbColor, setRgbColor] = useState();
  const [cmykColor, setCmykColor] = useState();

  useEffect(() => {
    if (editingSectionField.color && !hexColor && editingSectionField.type === 'title') {
      handleColorInitialization(editingSectionField.color);
    } else if (!editingSectionField.color && editingSectionField.type === 'title') {
      initializeDefaultColor();
    }
  }, [editingSectionField]);
  
  const handleColorInitialization = (initialColor) => {
    if (initialColor.includes('rgba')) {
      const rgbaValues = initialColor.match(/rgba?\((\d+), (\d+), (\d+),? (\d+\.?\d*)?\)/);
      if (rgbaValues) {
        const rgbaArray = [
          parseInt(rgbaValues[1]),
          parseInt(rgbaValues[2]),
          parseInt(rgbaValues[3])
        ];
        const hex = convert.rgb.hex(rgbaArray);
        setColorValues(hex);
      } else {
        setColorValues(initialColor);
      }
    } else {
      setColorValues(initialColor);
    }
  };

  const setColorValues = (newColor) => {
    setColor(newColor);
    setHexColor(newColor);
    setRgbColor(convert.hex.rgb(newColor));
    setCmykColor(convert.hex.cmyk(newColor));
  };
  const initializeDefaultColor = () => {
    const startHex = '#FFFFFF';
    setColorValues(startHex);
  };
  
  useEffect(() => {
    //console.log('Updated color:', color);
  }, [color]);
  
  const toggleColorPicker = (index, startColor) => {
    //console.log('startColor : ',startColor)
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
    const updatedComponents = editingField.components.map((field) => {
      if (field.id === editingSectionField.id) {
        return { ...field, color: color };
      }
      return field;
    });

    setColor(color);
    setEditingField({ ...editingField, components: updatedComponents });
    setEditingSectionField({...editingSectionField, color: color});
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
  
  const changeOptionColorHandler = (color, index, options_index) => {
    let newOptions = [];
    const updatedComponents = editingField.components.map((field) => {
      if (field.id === editingSectionField.id) {
        newOptions = field.dropdown.map((option, opt_index) => {
          if(opt_index === index){
            option.color = color;
          }
          return option;
        });
      }
      return field;
    });
    setColor(color);
    setEditingField({ ...editingField, components: updatedComponents });
    setEditingSectionField({...editingSectionField, dropdown: newOptions});
  };
  
  const handleColumnsColorChange = (newHexColor, index, optionIndex) => {
    setHexColor(newHexColor);
    const rgb = convert.hex.rgb(newHexColor);
    const cmyk = convert.rgb.cmyk(rgb);
  
    setRgbColor(rgb);
    setCmykColor(cmyk);
    changeColumnsColorHandler(newHexColor, index, optionIndex);
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
  const changeColumnsColorHandler = (color, index, optionIndex) => {
    const updatedEditingField = { ...editingSectionField };
    const updatedValue = updatedEditingField.value.map((section, secIndex) => {
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
    setEditingSectionField({...editingSectionField, value: updatedValue});
    
    const updatedComponents = editingField.components.map((field) => {
      if (field.id === editingSectionField.id) {
        return { ...field, value: updatedValue };
      }
      return field;
    });
    setEditingField({ ...editingField, components: updatedComponents });
  };
  

  const changeDateFormatHandler = (selectedFormat) => {
    setEditingField({...editingField, dateFormat: selectedFormat})
  };
  
  const changeTimeFormatHandler = (selectedFormat) => {
    setEditingField({...editingField, timeFormat: selectedFormat})
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
    removeFormSectionField(fieldId, editingField.id)
    setEditingSectionField({ id: '' });
    setEditingField({ id: '' });
  }

  const changeColumnTypeHandler = (type, index) => {
    let updatedValues = [];
    const updatedComponents = editingField.components.map((field) => {
      if (field.id === editingSectionField.id) {
        updatedValues = [...field.value];
        if (type === 'dropdown') {
          updatedValues[index] = {
            ...updatedValues[index],
            type: type,
            options: [
              { title: 'Option 1', selected: true },
              { title: 'Option 2', selected: false },
              { title: 'Option 3', selected: false }
            ]
          };
        } else {
          updatedValues[index] = {
            ...updatedValues[index],
            type: type,
            options: undefined,
          };
        }
      return {...field, value: updatedValues};
      }
      return field
    });
    setEditingField({ ...editingField, components: updatedComponents });
    setEditingSectionField({...editingSectionField, value: updatedValues});
  };
  
  const handleRemovingColumn = (columnIndex) => {
    let updatedValues = [];
    let updatedLabels = [];
    const updatedComponents = editingField.components.map((field) => {
      if (field.id === editingSectionField.id) {
        updatedValues = field.value.filter((_, index) => index !== columnIndex);
        updatedLabels = field.labels.filter((_, index) => index !== columnIndex);
        return { ...field, value: updatedValues, labels: updatedLabels };
      }
      return field;
    });
  
    setEditingField({ ...editingField, components: updatedComponents });
    setEditingSectionField({ ...editingSectionField, value: updatedValues, labels: updatedLabels });
  };
  
  const handleAddingNewColumn = () => {
    let updatedValues = [];
    let updatedLabels = [];
    const updatedComponents = editingField.components.map((field) => {
      if (field.id === editingSectionField.id) {
        updatedValues = [
          ...field.value,
          { type: 'input', value: '' }
        ];
        updatedLabels = [...field.labels, 'label'];
        return { ...field, value: updatedValues, labels: updatedLabels };
      }
      return field;
    });
  
    setEditingField({ ...editingField, components: updatedComponents });
    setEditingSectionField({ ...editingSectionField, value: updatedValues, labels: updatedLabels });
  };

  const handleTypeChange = (type) => {
    let newComponent = {
      type: type,
      value: '',
    };
  
    switch (type) {
      case 'dropdown':
        newComponent = {
          ...newComponent,
          dropdown: [
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
          radio: [
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
          checkbox: [
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
    { editingSectionField && editingSectionField !== '' ?
    <>
    <div className='field-editor-container'>
      <div className="field-editor__header">
        {titles_to_types_object[editingSectionField.type]}
        <div className="field-editor__actions">
          <button className="field-editor-remove-field" id="remove_icon" help-title="remove" 
          onClick={() => handleRemoveClick(editingSectionField.id)}>
            <img src={trash_icon} className="remove-icon"/>
          </button>
          <button className="field-editor-remove-field" id="duplicate_icon" help-title="duplicate" 
          onClick={() => duplicateField(editingSectionField.id)}>
            <img src={duplicate_icon} className="remove-icon"/>
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
              <input type="text" value={editingSectionField.title} onChange={e => changeFieldTitleHandler(e)} className="field-editor__input" />
            </div>
            {
              editingSectionField.type !== 'title' && editingSectionField.type !== 'columns' &&
              <div className="field-editor_checkbox-group">
                <div className='field-editor_checkbox_container'>
                  <label htmlFor="required" className="field-editor-label">
                    <input type="checkbox" id="required" className='field-editor_checkbox' 
                    checked={editingSectionField.required} onChange={changeFieldRequiredHandler}/>
                    Required
                  </label>
                </div>
                <div className='field-editor_checkbox_container'>
                  <label className="field-editor-label">
                    <input type="checkbox" id="read-only" className='field-editor_checkbox' 
                    checked={editingSectionField.read_only} onChange={changeFieldReadOnlyHandler}/>
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
              editingSectionField.type === 'columns' &&
              <div className="field-editor__field">
                <label className="field-editor__label">COLUMNS STYLE</label>
                <div className='field-editor_checkbox_container'>
                  <label htmlFor="column_style" className="field-editor-label">
                    <input type="checkbox" id="column_style" className='field-editor_checkbox' 
                    checked={editingSectionField.style === 'tabular'} onChange={changeColumnsStyleHandler}/>
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
      editingSectionField.type === 'columns' &&
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
                editingSectionField.type === 'columns'
                && (
                  <>
                    {editingSectionField.labels.map((label, index) => (
                      <div key={index} className="field-editor__field">
                        <label className="field-editor__label">{`${['First', 'Second', 'Third', 'Fourth', 'Fifth'][index]} label`}</label>
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
                          <div className={`field-editor-column-type${editingSectionField.value[index].type === 'dropdown' ? '-selected' : ''}`} onClick={() => changeColumnTypeHandler('dropdown', index)}>
                            Dropdown
                          </div> 
                          <div className={`field-editor-column-type${editingSectionField.value[index].type === 'short_answer' ? '-selected' : ''}`} onClick={() => changeColumnTypeHandler('short_answer', index)}>
                            Short answer
                          </div> 
                        </div>
                        <div className="field-editor_checkbox-group">
                          <div className='field-editor_checkbox_container'>
                            <label htmlFor="required" className="field-editor-label">
                              <input type="checkbox" id="required" className='field-editor_checkbox' 
                              checked={editingSectionField.required} onChange={changeFieldRequiredHandler}/>
                              Required
                            </label>
                          </div>
                          <div className='field-editor_checkbox_container'>
                            <label className="field-editor-label">
                              <input type="checkbox" id="read-only" className='field-editor_checkbox' 
                              checked={editingSectionField.read_only} onChange={changeFieldReadOnlyHandler}/>
                              <label htmlFor="read-only">Read-only</label>
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )
              }
              {
                editingSectionField.type !== 'title' &&  editingSectionField.type !== 'columns' &&
                <div className="field-editor_checkbox-group">
                  <div className='field-editor_checkbox_container'>
                    <label htmlFor="required" className="field-editor-label">
                      <input type="checkbox" id="required" className='field-editor_checkbox' 
                      checked={editingSectionField.required} onChange={changeFieldRequiredHandler}/>
                      Required
                    </label>
                  </div>
                  <div className='field-editor_checkbox_container'>
                    <label className="field-editor-label">
                      <input type="checkbox" id="read-only" className='field-editor_checkbox' 
                      checked={editingSectionField.read_only} onChange={changeFieldReadOnlyHandler}/>
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
        {(editingSectionField.type === 'short_answer' || editingSectionField.type === 'long_answer') && 
          <div className="option-content">
            <div className="option-group">
              <label>Pre-filled value</label>
              <div className="option-input">
                <input type="text" onChange={(e) => changeFieldPreFilledHandler(e)} value={editingSectionField.value}/>
              </div>
            </div>
          </div>
        }
        {editingSectionField.type === 'title' && 
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
        { editingSectionField.checkbox && 
          <div className="option-content">
            <div className="option-group">
              <label>OPTIONS</label>
                {editingSectionField.checkbox.map((option, index)=> (
                  <div key={index} className="option-input">
                    <input type="text" onChange={(e) => changeFieldCheckOptionHandler(e, index)} value={option.title}/>
                    <div className="option-buttons">
                      <button className="field-editor-add-button" onClick={() => addFieldCheckOptionHandler(index)}>+</button>
                      <button className="field-editor-remove-button" onClick={() => deleteFieldCheckOptionHandler(index)}>-</button>
                    </div>
                  </div>
                ))}
            </div>
            <div className="layout-group">
              <label>LAYOUT</label>
              <div className="field-editor-radio-group">
                <label>
                  <input type="radio" name="layout" value="vertical" 
                  onChange={changeFieldCheckboxLayoutHandler} checked={editingSectionField.layout == 'vertical'} />
                  Vertical
                </label>
                <label>
                  <input type="radio" name="layout" value="horizontal" 
                  onChange={changeFieldCheckboxLayoutHandler} checked={editingSectionField.layout == 'horizontal'}/>
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
        { editingSectionField.radio && 
          <div className="option-content">
            <div className="option-group">
              <label>OPTIONS</label>
                {editingSectionField.radio.map((option, index)=> (
                  <div key={index} className="option-input">
                    <input type="text" onChange={(e) => changeFieldRadioOptionHandler(e, index)} value={option.title}/>
                    <div className="option-buttons">
                      <button className="field-editor-add-button" onClick={() => addFieldRadioOptionHandler(index)}>+</button>
                      <button className="field-editor-remove-button" onClick={() => deleteFieldRadioOptionHandler(index)}>-</button>
                    </div>
                  </div>
                ))}
            </div>
            <div className="layout-group">
              <label>LAYOUT</label>
              <div className="field-editor-radio-group">
                <label>
                  <input type="radio" name="layout" value="vertical" 
                  onChange={changeFieldRadioLayoutHandler} checked={editingSectionField.layout == 'vertical'} />
                  Vertical
                </label>
                <label>
                  <input type="radio" name="layout" value="horizontal" 
                  onChange={changeFieldRadioLayoutHandler} checked={editingSectionField.layout == 'horizontal'}/>
                  Horizontal
                </label>
              </div>
            </div>
          </div>
        }
        { editingSectionField.type === 'date_time' && 
          <div className="option-content">
            <div className="option-group">
              <label>Date Format</label>
              <select
                value={editingSectionField.dateFormat}
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
                value={editingSectionField.timeFormat}
                onChange={changeTimeFormatHandler}
              >
                <option value="h:mm A">12 Hour (h:mm A)</option>
                <option value="HH:mm">24 Hour (HH:mm)</option>
              </select>
            </div>
          </div>
        }
        {editingSectionField.dropdown && 
        <DropdownOptions editingField={editingSectionField} changeListOptionHandler={changeFieldListOptionHandler} 
        handleColorChange={handleColorChange} toggleColorPicker={toggleColorPicker}
        colorPickerVisible={colorPickerVisible} hexColor={hexColor} rgbColor={rgbColor} cmykColor={cmykColor}
        handleRgbChange={handleRgbChange} handleHexChange={handleHexChange} handleCmykChange={handleCmykChange}
        addListOptionHandler={addFieldListOptionHandler} deleteListOptionHandler={deleteFieldListOptionHandler}
        handleOptionsSaving={handleOptionsSaving} chooseOptionsToChange={chooseOptionsToChange}/>
        }
        {
          editingSectionField.type === 'columns' && (
            <div className="option-content">
              {
                editingSectionField.value.map((value, index) => (
                  value.type === 'input' ?
                  <div key={index} className="option-group">
                    <label>Pre-filled value for input</label>
                    <div className="option-input">
                      <input type="text" onChange={(e) => changeColumnFieldPreFilledHandler(e, index)} value={value.value}/>
                    </div>
                  </div>
                  : value.type === 'dropdown' ?
                  <div key={index} className="option-group">
                    <label>
                      OPTIONS for {editingSectionField.labels[index]} 
                      <div className="option-group-features">
                        <div className='choose-option-button' onClick={() => chooseOptionsToChange(editingSectionField.id, index)}>
                          <img className="option-group-img" src={chooser_options_icon} alt='choose'/>
                        </div>
                        <img className="option-group-img" src={save_icon} 
                        onClick={()=> handleOptionsSaving(value.options)} alt='save'/>
                      </div>
                    </label>
                    {value.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="option-input">
                        <input
                          type="text"
                          onChange={(e) => changeFieldListOptionHandlerInColumns(e, optionIndex, index)}
                          value={option.title}
                        />
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
                        <div className="option-buttons">
                          <button
                            className="field-editor-add-button"
                            onClick={() => addFieldListOptionHandlerNew(optionIndex, index)}
                          >
                            +
                          </button>
                          <button
                            className="field-editor-remove-button"
                            onClick={() => deleteFieldListOptionHandlerNew(optionIndex, index)}
                          >
                            -
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  : <></>
                ))
              }
            </div>
          )
        }
        {
          editingSectionField.type === 'add_component_button' && (
            <div className="option-content">
              <div className="option-group">
                <label>Select component to add:</label>
                <ComponentTypeSelector selectedType={editingSectionField.adding_component.type} onChange={handleTypeChange} />
              </div>
            </div>
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

export default FormBuilderSectionComponentEditor;