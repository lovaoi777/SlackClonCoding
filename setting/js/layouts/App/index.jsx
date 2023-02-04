import React from 'react';
import loadable from '@loadable/component';
import { Routes, Route } from 'react-router-dom';

//loadable == 코드스플리팅하기 위함 , 언제불러올지
const Login = loadable(() => import('@pages/LogIn'));
const SignUp = loadable(() => import('@pages/SignUp'));
const Workspace = loadable(() => import('@layouts/Workspace'));

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/workspace/sleact" element={<Workspace />} />
      <Route path="/workspace/:workspace/*" element={<Workspace />} />
      {/* <Route path="/workspace/*" element={<Workspace />} /> */}
    </Routes>
  );
};

export default App;
