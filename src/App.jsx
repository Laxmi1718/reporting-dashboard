import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import theme from './theme';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import useAuth from './hooks/useAuth';

function App() {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {isAuthenticated ? <Dashboard onLogout={logout} /> : <Login onLogin={login} />}
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
