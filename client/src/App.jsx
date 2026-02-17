
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { ChatInterface } from './components/ChatInterface';
import { AdminUpload } from './components/AdminUpload';

function App() {
  const [currentView, setCurrentView] = useState('chat');

  return (
    <Layout currentView={currentView} setView={setCurrentView}>
      {currentView === 'chat' && <ChatInterface />}
      {currentView === 'admin' && <AdminUpload />}
    </Layout>
  );
}

export default App;
