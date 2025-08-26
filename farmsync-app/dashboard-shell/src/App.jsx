import React, { useState } from 'react';

const Sidebar = ({ onSelect }) => (
  <div style={{ width: 200, background: '#f0f0f0', height: '100vh', padding: 20 }}>
    <h3>Features</h3>
    <ul style={{ listStyle: 'none', padding: 0 }}>
      <li><button onClick={() => onSelect('yields')}>Yields</button></li>
      <li><button onClick={() => onSelect('workers')}>Workers</button></li>
      <li><button onClick={() => onSelect('financials')}>Financials</button></li>
      <li><button onClick={() => onSelect('inventory')}>Inventory</button></li>
      <li><button onClick={() => onSelect('reports')}>Reports</button></li>
    </ul>
  </div>
);

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 100 }}>
      <h2>Login</h2>
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={() => onLogin(username, password)}>Login</button>
    </div>
  );
};

const Dashboard = ({ selected }) => (
  <div style={{ padding: 40 }}>
    <h1>Dashboard Insights</h1>
    <p>Welcome! Select a feature from the sidebar.</p>
    {selected && <iframe title={selected} src={`/${selected}/public/index.html`} style={{ width: '100%', height: '600px', border: 'none' }} />}
  </div>
);

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [selected, setSelected] = useState(null);
  return loggedIn ? (
    <div style={{ display: 'flex' }}>
      <Sidebar onSelect={setSelected} />
      <Dashboard selected={selected} />
    </div>
  ) : (
    <Login onLogin={() => setLoggedIn(true)} />
  );
};

export default App;
