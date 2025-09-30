import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import TestSMEA from './TestSMEA';
import './App.css';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <header className="App-header">
        <h1>SecuraSphere</h1>
        <p className="subtitle">
          A Cybersecurity Awareness Platform
        </p>
      </header>

      <main className="App-main">
        <section className="intro">
          <p>
            Welcome to <strong>SecuraSphere</strong>! Explore our interactive tools and resources
            to learn about your online security and privacy. Choose a module below to get started.
          </p>
        </section>

        <section className="modules">
          <div className="card">
            <h1>🔑</h1>
            <h2>Password Checker</h2>
            <p>Test your password strength and generate secure ones.</p>
            <button>Go</button>
          </div>

          <div className="card">
            <h1>📧</h1>
            <h2>Phishing Training</h2>
            <p>Learn how to spot suspicious emails through practice.</p>
            <button>Go</button>
          </div>

          <div className="card">
            <h1>📱</h1>
            <h2>Social Media Analyzer</h2>
            <p>See what personal info you might be exposing online.</p>
            <button onClick={() => navigate('/instagram-test')}>Go</button>
          </div>
        </section>
      </main>

      <footer className="App-footer">
        <p>Team CAWWZ | UF Senior Project | Fall 2025</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/instagram-test" element={<TestSMEA />} />
      </Routes>
    </Router>
  );
}

export default App;
