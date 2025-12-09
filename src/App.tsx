import Header from './components/layout/Header/Header';
import Footer from './components/layout/Footer/Footer';
import Hero from './components/sections/Hero/Hero';
import OurStory from './components/sections/OurStory/OurStory';
import FeaturedItems from './components/sections/FeaturedItems/FeaturedItems';
import LocationHours from './components/sections/LocationHours/LocationHours';
import styles from './App.module.css';
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
              subtitle="En nuestro restobar, cada encuentro cuenta una historia. Donde los aromas de café y buena comida se mezclan con conversaciones y momentos memorables. Porque más que servir, creamos experiencias. Y queremos que vivas la magia de la buena compañía en cada visita."
            />


            <div id="featured-items">
              <FeaturedItems items={featuredItems} />
            </div>

            <div id="our-story">
              <OurStory
                title="Nuestra Historia"
                content="Nacidos en Enero de 2025, Mana Coffee se ha convertido en un lugar especial para los amantes del café y la buena comida."
              />
            </div>

            <div id="location-hours">
              <LocationHours
                mapImage="/images/MAP.webp"
                address="Carrera 9 Calle 5, Pamplona, Norte de Santander, Colombia"
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
