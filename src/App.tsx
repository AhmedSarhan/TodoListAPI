import React, { useContext } from 'react';
import './App.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from './Context/AppContext';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Header from './components/Navigation/Header';
import CustomSnackBarMessage from './components/common/CustomSnackBarMessage';

axios.defaults.baseURL = process.env.REACT_APP_API_URI;

function App() {
  console.log(axios.defaults.baseURL);
  console.log(process.env.REACT_APP_API_URI);
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });
  const { loggedInState } = useContext(AppContext);
  return (
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <Header />
        <Switch>
          <Route exact path="/">
            {loggedInState ? <Home /> : <Auth />}
          </Route>
          <Route path="/profile/:username">
            {loggedInState ? <Profile /> : <Auth />}
          </Route>
        </Switch>
        <CustomSnackBarMessage />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
