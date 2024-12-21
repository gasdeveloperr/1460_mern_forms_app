import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import HomePage from './HomePage';
import FormBuilder from './FormBuilder';
import CorrectiveActionsPage from './CorrectiveActionsPage';
import DashboardPage from './DashboardPage';
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
import ActivatePage from './ActivatePage';
import ErrorPage from './ErrorPage';
import ClientsPage from './ClientsPage';

import './index.css';
import PeoplePage from './PeoplePage';
import DocumentsPage from './DocumentsPage';
import InDevelopmentPage from './InDevelopmentPage';

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
              <Route path="/error" element={<ErrorPage />} />
              <Route path="/activate/:token" element={<ActivatePage />} />
              <Route path="/register" element={<Register />} />
              <Route element={<ProtectedRoute />}>
                <Route path='/' element={<HomePage />}/>
                <Route path='/clients' element={<ClientsPage />}/>
                <Route path='/clients/:clientId?' element={<ClientsPage />}/>
                <Route path='/people' element={<PeoplePage />}/>
                <Route path='/documents' element={<DocumentsPage />}/>
                <Route path="/forms/builder/:formId?" element={<FormBuilder />} />
                <Route path="/forms/dashboard" element={<DashboardPage />} />
                <Route path="/forms/results" element={<ResultsBoard />} />
                <Route path="/forms/results/:formId?" element={<ResultsBoard />} />
                <Route path="/forms/live/:formId?" element={<FormLive />} />
                <Route path="/account/settings" element={<UserSettingsPage />} />
                <Route path="/administration" element={<AdminPage />} />
                <Route path="/incidents" element={<InDevelopmentPage />} />
                <Route path="/corrective_actions" element={<CorrectiveActionsPage />} />
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