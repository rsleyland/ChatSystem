import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard.page.js';
import { Login } from './pages/Auth/Login.page.js';
import { PasswordResetChange } from './pages/Auth/PasswordResetChange.page.js';
import { Register } from './pages/Auth/Register.page.js';
import { PasswordResetRequest } from './pages/Auth/PasswordResetRequest.page.js';
import { ConfirmEmail } from './pages/Auth/ConfirmEmail.page.js';
import { Settings } from './pages/Settings.page.js';
import { AxiosResponseInterceptor, AxiosRequestInterceptor } from './AxiosConfig.js';


function App() {
  AxiosRequestInterceptor();
  AxiosResponseInterceptor();
  return (
    <Router>
      <main>
        <Container fluid className="p-0 bg-dark" >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reset-password" element={<PasswordResetRequest />} />
            <Route path="/reset-password/:code" element={<PasswordResetChange />} />
            <Route path="/confirm-email/:code" element={<ConfirmEmail />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Container>
      </main>
    </Router>
  );
}

export default App;
