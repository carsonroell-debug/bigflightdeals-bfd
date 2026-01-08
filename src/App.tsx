import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import ToolsSection from './components/ToolsSection';
import FlightDealsSection from './components/FlightDealsSection';
import FlightWidget from './components/FlightWidget';
import PlannerSection from './components/PlannerSection';
import AboutSection from './components/AboutSection';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <ToolsSection />
        <FlightDealsSection />
        <FlightWidget />
        <PlannerSection />
        <AboutSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
