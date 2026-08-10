import { useCallback, useState } from 'react';

const SESSION_KEY = 'dashboard_auth';

// Client-side only gate - the credential ships in the built bundle, so this
// is a soft "keep casual visitors out" check, not real security. A backend
// login endpoint would be needed for that.
function checkCredentials(username, password) {
  return (
    username === import.meta.env.VITE_ADMIN_USERNAME &&
    password === import.meta.env.VITE_ADMIN_PASSWORD
  );
}

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem(SESSION_KEY) === 'true');

  const login = useCallback((username, password) => {
    if (!checkCredentials(username, password)) return false;
    sessionStorage.setItem(SESSION_KEY, 'true');
    setIsAuthenticated(true);
    return true;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, login, logout };
}
