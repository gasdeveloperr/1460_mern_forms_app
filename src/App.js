import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import HomePage from './HomePage';
import FormBuilder from './FormBuilder';
import DashboardPage from './DashboardPage';
import FormUsingPage from './FormUsingPage';
import { OutsideClickProvider } from './OutsideClickContext';
import FormLive from './FormLive';
import ResultsBoard from './ResultsBoard';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';
import NotFoundPage from './NotFoundPage';
import Register from './Register';
import AdminPage from './AdminPage';
import UserSettingsPage from './UserSettingsPage';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  return (
    <Router>
      <DndProvider backend={HTML5Backend}>
      <div className="App">
        <div className='content'>
          <ToastContainer />
          <OutsideClickProvider>
            <Routes >
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<ProtectedRoute />}>
                <Route path='/' element={<HomePage />}/>
                <Route path="/forms/builder/:formId?" element={<FormBuilder />} />
                <Route path="/forms/dashboard" element={<DashboardPage />} />
                <Route path="/forms/results" element={<ResultsBoard />} />
                <Route path="/forms/live/:formId?" element={<FormLive />} />
                <Route path="/forms/:formId" element={<FormUsingPage />} />
                <Route path="/account/settings" element={<UserSettingsPage />} />
                <Route path="/administration" element={<AdminPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes >
          </OutsideClickProvider>
        </div>
      </div>
      </DndProvider>
    </Router>
  );
};

export default App;