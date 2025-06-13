import React from "react";
import Header from "./layouts/Header";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { Routes, Route } from "react-router-dom";
import Feed from "./pages/feed/Feed";
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route path="/feed" element={<Feed />} />
        </Route>

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;
