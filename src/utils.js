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


export const addingNewComponent = (componentData) => {
  const newField = {
    id: Date.now(),
    type: componentData.type,
    title: componentData.title,
    value: '',
    options: [],
    required: false,
    read_only: false,
  };
  if(componentData.type === 'name'){
    newField.labels = ['First name', 'Last name']
  }
  if(componentData.type === 'checkbox'){
    newField.checkbox = [
      {title: 'Option 1', checked: true},
      {title: 'Option 2', checked: false},
      {title: 'Option 3', checked: false}
    ];
    newField.layout = 'vertical';
  }
  if(componentData.type === 'radio'){
    newField.radio = [
      {title: 'Option 1', checked: true},
      {title: 'Option 2', checked: false},
      {title: 'Option 3', checked: false}
    ];
    newField.layout = 'vertical';
  }
  if(componentData.type === 'dropdown'){
    newField.dropdown = [
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