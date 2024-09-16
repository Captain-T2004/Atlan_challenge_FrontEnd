import React from 'react';
import { Toaster } from 'react-hot-toast';
import PublicView from './components/PublicView';
import Header from './components/Header';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100">
      <Toaster position="top-center" />
      <Header/>
      <main className="container mx-auto px-4 py-8">
        <PublicView />
      </main>
    </div>
  );
}

export default App;