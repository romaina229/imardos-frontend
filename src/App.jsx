import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HeroSection from './components/home/HeroSection';
import DomainsSection from './components/home/DomainsSection';
import ProjectsSection from './components/home/ProjectsSection';
import PartnersSection from './components/home/PartnersSection';
import TestimonialsSection from './components/home/TestimonialsSection';
import GallerySection from './components/home/GallerySection';
import About from './pages/About';
import Actions from './pages/Actions';
import ActionDetail from './pages/ActionDetail';
import Contact from './pages/Contact';
import Donate from './pages/Donate';
import AdminGate from './admin/AdminGate';

// --- AJOUTEZ CES 4 LIGNES ICI (EN HAUT) ---
import Jobs from './pages/Jobs';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import JobResults from './pages/JobResults';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Resources from './pages/Resources'

// Remonte en haut de page à chaque changement de route
const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

const Home = () => (
  <>
    <HeroSection />
    <div className="pt-24">
      <DomainsSection />
    </div>
    <ProjectsSection />
    <PartnersSection />
    <TestimonialsSection />
    <GallerySection />
  </>
);

// Le site public affiche Navbar + Footer ; l'espace admin a sa propre barre latérale
const Layout = ({ children }) => {
  const { pathname } = useLocation();
  const isAdminArea = pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <ScrollToTop />
      {!isAdminArea && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!isAdminArea && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/nos-actions" element={<Actions />} />
          <Route path="/nos-actions/:id" element={<ActionDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/don" element={<Donate />} />
          {/* --- AJOUTEZ CES 4 LIGNES ICI (DANS LES ROUTES) --- */}
          <Route path="/offres-emploi" element={<Jobs />} />
          <Route path="/evenements" element={<Events />} />
          <Route path="/galerie" element={<Gallery />} />
          <Route path="/results" element={<JobResults />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/ressources" element={<Resources />} />
          {/* -------------------------------------------------- */}

          {/* La session admin (connexion, rechargement de page, expiration) est gérée dans AdminGate */}
          <Route path="/admin" element={<AdminGate />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;