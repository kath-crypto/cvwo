import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, Container } from '@mui/material';
import TopicList from './components/topics/TopicList';
import TopicDetail from './components/topics/TopicDetail';
import PostDetail from './components/posts/PostDetail';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CssBaseline />
      <Router>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<TopicList />} />
            <Route path="/topics" element={<TopicList />} />
            <Route path="/topics/:id" element={<TopicDetail />} />
            <Route path="/posts/:id" element={<PostDetail />} />

            {/* Example Protected Route */}
            {/* <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <SomeProtectedComponent />
                </ProtectedRoute>
              }
            /> */}
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
};

export default App;