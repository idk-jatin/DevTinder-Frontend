import React from "react";
import AppLayout from "./layouts/AppLayout";
import AuthPage from "./pages/AuthPage";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "./utils/constants";
import { updateUser } from "./features/auth/authSlice";
import ProtectedRoute from "./components/ProtectedRoute";

import Feed from "./pages/feed/Feed";
import EditProfile from "./pages/EditProfile"; // Used as ProfilePage

import Matches from "./pages/Matches";
import Requests from "./pages/Requests";
import Chat from "./pages/Chat";
import Settings from "./pages/Settings";

// Placeholders for new pages
const Notifications = () => <div>Notifications Page</div>;

const App = () => {
  const dispatch = useDispatch();
  const [isCheckingSession, setIsCheckingSession] = React.useState(true);

  React.useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/profile/view`, { withCredentials: true });
        if (res.data?.profile) {
          dispatch(updateUser(res.data.profile));
        }
      } catch (err) {
        // User not logged in, ignore
      } finally {
        setIsCheckingSession(false);
      }
    };
    checkSession();
  }, [dispatch]);

  if (isCheckingSession) {
    return <div className="h-screen w-full flex items-center justify-center bg-background text-primary font-mono text-xl animate-pulse">Initializing Terminal...</div>;
  }

  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AppLayout />}>
          {/* We can make feed the default or a dashboard */}
        <Route index element={<Feed />} />
        <Route path="feed" element={<Feed />} />
        <Route path="profile" element={<EditProfile/>} />
        <Route path="matches" element={<Matches />} />
        <Route path="requests" element={<Requests />} />
        <Route path="chat" element={<Chat />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="/signup" element={<AuthPage initialMode="signup" />} />
      <Route path="/login" element={<AuthPage initialMode="login" />} />
    </Routes>
  );
};

export default App;
