import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Steps from './components/Steps';
import TrendingPolls from './components/TrendingPolls';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <Hero />
      <Stats />
      <Steps />
      <TrendingPolls />
      <FinalCTA />
      <Footer />
    </div>
  );
}

export default App;
