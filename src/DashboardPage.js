import Header from './Header';
import { Link } from 'react-router-dom';

function DashboardPage() {
  const forms = [
    { id: '1', name: 'Form 1' },
    { id: '2', name: 'Form 2' },
    { id: '3', name: 'Form 3' },
    // ...
  ];

  return (
    <div>
      <Header/>
      <div className='page-content'>
        <h1>Forms Dashboard</h1>
        <ul>
          {forms.map((form) => (
            <li key={form.id}>
              <Link to={`/forms/${form.id}`}>{form.name}</Link>
            </li>
          ))}
        </ul>
        <Link to="/forms/builder">Create New Form</Link>
      </div>
    </div>
  );
}

export default DashboardPage;