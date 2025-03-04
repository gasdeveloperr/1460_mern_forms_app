import moment from 'moment';


export const getUserId = () => {
  const id = localStorage.getItem('userId');
  return id
}
export const getUserEmail = () => {
  const email = localStorage.getItem('userEmail');
  return email
}
export const getUserRole = () => {
  const role = localStorage.getItem('userRole');
  return role
}
export const getCurrentOrganization = () => {
  const role = localStorage.getItem('userOrganisation');
  return role
}

export const getAuthToken = () => {
  const role = localStorage.getItem('token');
  return role
}

export const formatDate = (date) => {
  return moment(date).format('HH:mm:ss DD/MM/YYYY'); // Example: 08/02/2023 15:09:35
};


export const addingNewComponent = (componentData, sectionId) => {
  const newField = {
    id: Date.now(),
    type: componentData.type,
    title: componentData.title,
    value: '',
    options: [],
    required: false,
    read_only: false,
  };
  if(sectionId){
    newField.sectionId = sectionId
  }
  if(componentData.type === 'name'){
    newField.labels = ['First name', 'Last name']
  }
  if(componentData.type === 'checkbox' || componentData.type === 'radio'){
    newField.options = [
      {title: 'Option 1', checked: true},
      {title: 'Option 2', checked: false},
      {title: 'Option 3', checked: false}
    ];
    newField.layout = 'vertical';
  }
  if(componentData.type === 'dropdown'){
    newField.options = [
      {title: 'Option 1', selected: true},
      {title: 'Option 2', selected: false},
      {title: 'Option 3', selected: false}
    ];
  }
  if(componentData.type === 'date_time'){
    newField.dateFormat = 'MM/DD/YYYY'
    newField.timeFormat = '12'
    newField.value = {
      date: '',
      time: '',
    }
  }
  if(componentData.type === 'double_section'){
    newField.labels = ['section 1', 'section 2']
    newField.value = [ 
      {
        options: [
          { title: 'Option 1', selected: true },
          { title: 'Option 2', selected: false },
          { title: 'Option 3', selected: false }
        ]
      }, 
      {
        options: [
          { title: 'Option 1', selected: true },
          { title: 'Option 2', selected: false },
          { title: 'Option 3', selected: false }
        ]
      }
    ];
    newField.sectionsType = 'default';
  }
  if(componentData.type === 'triple_section'){
    newField.labels = ['section 1', 'section 2', 'section 3' ];
    newField.value = [
      {
        options: [
          { title: 'Option 1', selected: true },
          { title: 'Option 2', selected: false },
          { title: 'Option 3', selected: false }
        ]
      }, 
      {
        options: [
          { title: 'Option 1', selected: true },
          { title: 'Option 2', selected: false },
          { title: 'Option 3', selected: false }
        ]
      }, 
      {
        options: [
          { title: 'Option 1', selected: true },
          { title: 'Option 2', selected: false },
          { title: 'Option 3', selected: false }
        ]
      }
    ];
    newField.sectionsType = 'default';
  }
  if(componentData.type === 'two_inputs_section'){
    newField.labels = ['section 1', 'section 2',]
    newField.value = [ 
      '',
      ''
    ];
    newField.sectionsType = 'inputs';
  }
  if(componentData.type === 'triple_inputs_section'){
    newField.labels = ['section 1', 'section 2', 'section 3',]
    newField.value = [ 
      '',
      '',
      ''
    ];
    newField.sectionsType = 'inputs';
  }
  if(componentData.type === 'four_inputs_section'){
    newField.labels = ['section 1', 'section 2', 'section 3', 'section 4']
    newField.value = [ 
      '',
      '',
      '',
      ''
    ];
    newField.sectionsType = 'inputs';
  }
  if(componentData.type === 'five_inputs_section'){
    newField.labels = ['section 1', 'section 2', 'section 3', 'section 4','section 5']
    newField.value = [ 
      '',
      '',
      '',
      '',
      ''
    ];
    newField.sectionsType = 'inputs';
  }
  if(componentData.type === 'multi_section'){
    newField.labels = ['section 1', 'section 2', 'section 3' ];
    newField.value = [
      '', 
      {
        options: [
          { title: 'Option 1', selected: true },
          { title: 'Option 2', selected: false },
          { title: 'Option 3', selected: false }
        ]
      }, 
      ''
    ];
    newField.sectionsType = 'default';
  }
  if(componentData.type === 'columns'){
    newField.labels = ['label 1', 'label 2', 'label 3' ];
    newField.value = [
      {
        type: 'short_answer',
        value: ''
      }, 
      {
        type: 'short_answer',
        value: ''
      }, 
      {
        type: 'dropdown',
        options: [
          { title: 'Option 1', selected: true },
          { title: 'Option 2', selected: false },
          { title: 'Option 3', selected: false }
        ]
      }, 
    ];
    newField.sectionsType = 'default';
  }
  if (componentData.type === 'add_component_button'){
    newField.adding_component = {
      type: 'short_answer',
      value: ''
    }
  }
  if (componentData.type === 'section') {
    newField.components = []
  }
  return newField; 
};
export const addingNewCustomComponent = (componentData, sectionId) => {
  const newField = {
    id: Date.now(),
    type: componentData.type,
    title: componentData.title,
    value: componentData.value || '',
    options: componentData.options || [],
    layout: componentData.layout || '',
    required: componentData.required || false,
    read_only: componentData.read_only || false,
  };
  if(sectionId){
    newField.sectionId = sectionId
  }
  if(componentData.type === 'name'){
    newField.labels = componentData.labels
  }
  if (componentData.type === 'section') {
    const unicIdComponents = componentData.components.map(component => {
      return {...component, id: Date.now()+ Math.floor(Math.random() * 1000), sectionId: newField.id}
    });
    newField.components = unicIdComponents
  }
  return newField; 
};

  // Function to initialize and update formData based on fieldType
  export function initializeFieldData({ element, columnIndex, rowIndex, elementBack, 
    formData, fieldType, customType, sectionName, columnType,
    correctiveActionText,
    correctiveActionId }) {

    let correctiveActionData = {}
    if(correctiveActionText){
       correctiveActionData = { ...correctiveActionData,
        text: correctiveActionText,
        id: correctiveActionId
    }
    //console.log('saving this corrective action : ', correctiveActionData)

    }
    if (!formData[element.id]) {
      switch(fieldType){
        case 'double_section' :
          formData[element.id] = {name: elementBack.title, value:[]}
          break;
        case 'triple_section' :
          formData[element.id] = {name: elementBack.title, value:[]}
          break;
        case 'two_inputs_section' :
          formData[element.id] = {name: elementBack.title, value:[]}
          break;
        case 'triple_inputs_section' :
          formData[element.id] = {name: elementBack.title, value:[]}
          break;
        case 'four_inputs_section' :
          formData[element.id] = {name: elementBack.title, value:[]}
          break;
        case 'five_inputs_section' :
          formData[element.id] = {name: elementBack.title, value:[]}
          break;
        case 'multi_section' :
          formData[element.id] = {name: elementBack.title, value:[]}
          break;
        case 'columns' :
          formData[element.id] = {name: elementBack.title, value:[]}
          break;
        case 'checkbox':
          formData[element.id] = {name: elementBack.title, value:[]}
          break;
        case 'name': 
          formData[element.id] = {name: elementBack.title, value:{}}
          break;
        case 'date_time':  
          formData[element.id] = {name: elementBack.title, value:{}}
          break;
        default:
          formData[element.id] = {name: elementBack.title, value:''};
          break;
      }
    }
    //setting element type for subm data field
    formData[element.id].type = fieldType;

    //console.log('element.id  : ',element.id, formData[element.id])

    switch(fieldType){
      case 'double_section' :
        formData[element.id].value.push({label: sectionName, value: element.value});
        break;
      case 'triple_section' :
        formData[element.id].value.push({label: sectionName, value: element.value});
        break;
      case 'two_inputs_section' :
        formData[element.id].value.push(element.value);
        break;
      case 'triple_inputs_section' :
        formData[element.id].value.push(element.value);
        break;
      case 'four_inputs_section' :
        formData[element.id].value.push(element.value);
        break;
      case 'five_inputs_section' :
        formData[element.id].value.push(element.value);
        break;
      case 'multi_section' :
        formData[element.id].value.push(element.value);
        break;
      case 'columns' :
        if (!Array.isArray(formData[element.id].value[rowIndex])) {
          formData[element.id].value[rowIndex] = [];
        }
        switch (columnType) {
          case 'checkbox':
            if (element.checked) {
              if (!Array.isArray(formData[element.id].value[rowIndex][columnIndex])) {
                formData[element.id].value[rowIndex][columnIndex] = [];
              }
              const entry = { result: element.name };
              if (correctiveActionData) {
                entry.correctiveActionData = correctiveActionData;
              }
              formData[element.id].value[rowIndex][columnIndex].push(entry);
            }
            break;
          case 'radio':
            if (!formData[element.id].value[rowIndex]) {
              formData[element.id].value[rowIndex] = [];
            }
            if (element.checked) {
              const entry = { result: element.value };
              if (correctiveActionData) {
                entry.correctiveActionData = correctiveActionData;
              }
              formData[element.id].value[rowIndex][columnIndex] = entry;
            } else {
              formData[element.id].value[rowIndex][columnIndex] = '';
            }
            break;
          case 'dropdown':
            if(correctiveActionData){
              formData[element.id].value[rowIndex][columnIndex] = {result: element.value, correctiveActionData: correctiveActionData};
            }else{
              formData[element.id].value[rowIndex][columnIndex] = {result: element.value};
            }
            break;
          default:
            formData[element.id].value[rowIndex][columnIndex] = element.value;
            break;
        }
        break;
      case 'checkbox':
        if (element.checked) {
          if(correctiveActionData){
            formData[element.id].value.push({result: element.name, correctiveActionData: correctiveActionData});
          } else{
            formData[element.id].value.push({result: element.name});
          }
        };
        break;
      case 'radio': 
        if (element.checked) {
          if(correctiveActionData){
            formData[element.id].value = {result: element.value, correctiveActionData: correctiveActionData};
          }else{
            formData[element.id].value = {result: element.value};
          }
        }
        break;
      case 'dropdown':
        if(correctiveActionData){
          formData[element.id].value = {result: element.value, correctiveActionData: correctiveActionData};
        }else{
          formData[element.id].value = {result: element.value};
        }
        break;
      case 'name': 
        if (customType === 'first_name') {
          formData[element.id].value.first_name = element.value;
        }
        if (customType === 'last_name') {
          formData[element.id].value.last_name = element.value;
        }
        break;
      case 'date_time':  
        if (customType === 'date') {
          formData[element.id].value.date = element.value;
        }
        if (customType === 'time') {
          formData[element.id].value.time = element.value;
        }
        break;
      default:
        if(correctiveActionData){
          formData[element.id].value = {result: element.value, correctiveActionData: correctiveActionData};
        }else{
          formData[element.id].value = {result: element.value};
        }
        break;
    }
    //console.log('formData : ', formData)
  }