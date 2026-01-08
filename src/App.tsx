import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import ToolsSection from './components/ToolsSection';
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
        <PlannerSection />
        <AboutSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
