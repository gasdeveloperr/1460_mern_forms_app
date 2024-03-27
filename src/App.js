import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import HomePage from './HomePage';
import FormBuilder from './FormBuilder';
import DashboardPage from './DashboardPage';
import FormUsingPage from './FormUsingPage';
import { OutsideClickProvider } from './OutsideClickContext';
import FormLive from './FormLive';



const App = () => {
  return (
    <Router>
      <DndProvider backend={HTML5Backend}>
      <div className="App">
        <div className='content'>
          <OutsideClickProvider>
            <Routes >
              <Route path='/' element={<HomePage />}/>
              {/* <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} /> */}
              
              <Route path="/forms/builder/:formId?" element={<FormBuilder />} />
              <Route path="/forms/dashboard" element={<DashboardPage />} />
              <Route path="/forms/live/:formId?" element={<FormLive />} />
              <Route path="/forms/:formId" element={<FormUsingPage />} />
            </Routes >
          </OutsideClickProvider>
        </div>
      </div>
      </DndProvider>
    </Router>
  );
};

export default App;