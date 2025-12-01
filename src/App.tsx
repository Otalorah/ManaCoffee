import Header from './components/layout/Header/Header';
import Footer from './components/layout/Footer/Footer';
import Hero from './components/sections/Hero/Hero';
import OurStory from './components/sections/OurStory/OurStory';
import FeaturedItems from './components/sections/FeaturedItems/FeaturedItems';
import Gallery from './components/sections/Gallery/Gallery';
import LocationHours from './components/sections/LocationHours/LocationHours';
import styles from './App.module.css';
import galleryImages from './data/galleryImages.json';
import featuredItems from './data/featuredItems.json';

function App() {

  // Landing Page
  return (
    <div className={styles.root}>
      <div className={styles.layoutContainer}>
        <Header />
        <div className={styles.mainContent}>
          <div className={styles.contentContainer}>
            <Hero
              title="Bienvenidos a Mana Coffee"
              subtitle="En nuestra cafetería creemos que cada taza cuenta una historia. Aquí, el aroma del café recién preparado se mezcla con conversaciones que reconfortan y momentos que se guardan para siempre. Porque más que servir bebidas, creamos encuentros. El sabor de la compañía es insuperable. Y queremos que lo vivas en cada visita."
              backgroundImage="https://lh3.googleusercontent.com/aida-public/AB6AXuAWrcTFsTjykeJ4ZLzXRE72er6FE-C2qxLui6im-rWb-Jl0tR3PdUOlwQgYyKNrWAVZfdcqAUUuxILraRsG20X24kg9f3gUVdNFF9A-__R23iyC45SSlDJ1Fyne21C6Svhe3JIci4v5lx47sMYOyh1VPDTFytrg1f9-n2OBXYkXZXW3NyaojP5BZfSgiGm7YPxiFyojqB2TQgFriVpWGxuTS2_PQeBwyfSHTSizHb2tT6fL_O8LbnKMTbUeog5kKWdgMpNb9oELQg"
            />

            <div id="our-story">
              <OurStory
                title="Nuestra Historia"
                content="Fundada en 2010, Coffee Corner ha sido un lugar querido para los amantes del café y los visitantes casuales. Nuestra pasión por el café de calidad y el servicio amable nos ha convertido en un favorito local. Obtenemos nuestros granos de las mejores plantaciones del mundo, asegurando que cada taza sea una experiencia deliciosa."
              />
            </div>

            <div id="featured-items">
              <FeaturedItems items={featuredItems} />
            </div>

            <div id="gallery">
              <Gallery images={galleryImages} />
            </div>

            <div id="location-hours">
              <LocationHours
                mapImage="https://lh3.googleusercontent.com/aida-public/AB6AXuDNASFpVA7gAYyLiXHRMq4fRYS7ROwekzD3vmcdxbdNgw6gc7H-wiPOHP5P8qO4Qr3gqCcSLD3re9Zo34mnejXUHX5V75aLGy-cQUHEs_aScEpDhQ-5CZ1-QuZuejz3gEpkOHd6azin_yeBBE7YIX4Wfl_-N2UGkhTcQx39WnKp_nY03YDaYNaW2knbShMb5WbEsmhA36fgLeWT6Zj6SNx72vCvZ3BtmHiKuXOopTKfoxJt5Q3Jaww0SKgdA3m_7QPFrcfgLqrnjg"
                address="Carrera 9 Calle 5, Pamplona, Norte de Santander, Colombia"
                hours="Lunes - Domingo: 7 AM - 9 PM"
              />
            </div>
          </div>
        </div>
        <div id="contact">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
