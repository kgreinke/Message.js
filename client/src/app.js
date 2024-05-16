import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import ChatRoom from './components/ChatRoom';

/*
const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/chatroom/:roomName" component={ChatRoom} />
      </Switch>
    </Router>
  );
};
*/
const App = () => {
  return (
    <div>
      <ChatRoom />
    </div>
  )
}

export default App;