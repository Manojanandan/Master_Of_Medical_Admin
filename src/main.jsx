import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CssBaseline } from "@mui/material";
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Store from './redux/Store.jsx';
import { AuthProvider } from './pages/routes/AuthContext';


createRoot(document.getElementById('root')).render(
  <Provider store={Store}>
    <AuthProvider>
      <BrowserRouter>
        <CssBaseline />
        <App />
      </BrowserRouter>
    </AuthProvider>
  </Provider>
)
