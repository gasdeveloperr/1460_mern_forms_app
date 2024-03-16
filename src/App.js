import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import HomePage from './HomePage';
import FormBuilderPage from './FormBuilderPage';
import DashboardPage from './DashboardPage';
import FormUsingPage from './FormUsingPage';



const App = () => {
  return (
    <Router>
      <DndProvider backend={HTML5Backend}>
      <div className="App">
        <div className='content'>
          <Routes >
            <Route path='/' element={<HomePage />}/>
            {/* <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} /> */}
            
            <Route path="/forms/builder" element={<FormBuilderPage />} />
            <Route path="/forms/dashboard" element={<DashboardPage />} />
            <Route path="/forms/:formId" element={<FormUsingPage />} />
          </Routes >
        </div>
      </div>
      </DndProvider>
    </Router>
  );
};

export default App;