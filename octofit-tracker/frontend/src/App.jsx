import { NavLink, Route, Routes } from 'react-router-dom';
import appLogo from '../../../docs/octofitapp-small.png';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

const navigation = [
  { to: '/', label: 'Users' },
  { to: '/activities', label: 'Activities' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/teams', label: 'Teams' },
  { to: '/workouts', label: 'Workouts' },
];

function App() {
  return (
    <div className="min-vh-100 bg-light text-dark">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container">
          <NavLink className="navbar-brand d-flex align-items-center gap-2" to="/">
            <img src={appLogo} alt="Octofit app logo" width="32" height="32" className="rounded-circle" />
            <span>Octofit Tracker</span>
          </NavLink>

          <div className="navbar-nav d-flex flex-row flex-wrap gap-2 ms-auto">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `nav-link px-3 py-2 rounded ${isActive ? 'bg-primary-subtle text-primary fw-semibold' : 'text-white-50'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      <main className="container py-4">
        <div className="alert alert-info small mb-4" role="alert">
          Set <code>VITE_CODESPACE_NAME</code> in <code>.env.local</code> to use the GitHub Codespaces API URL. If it is not set, the app falls back to localhost.
        </div>

        <Routes>
          <Route path="/" element={<Users />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
