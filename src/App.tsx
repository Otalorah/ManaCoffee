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
              subtitle="En nuestro restobar creemos que cada taza, cada plato y cada encuentro cuenta una historia. Aquí, el aroma del café recién preparado se funde con deliciosos sabores, se mezcla con conversaciones que reconfortan y da vida a momentos que se guardan para siempre. Porque más que servir café o comida, creamos experiencias. El sabor de la buena compañía es insuperable. Y queremos que lo vivas en cada visita, ya sea para desayunar, almorzar, cenar o simplemente disfrutar de una buena copa."
            />


            <div id="featured-items">
              <FeaturedItems items={featuredItems} />
            </div>

            <div id="our-story">
              <OurStory
                title="Nuestra Historia"
                content="Fundada en 2010, Coffee Corner ha sido un lugar querido para los amantes del café y los visitantes casuales. Nuestra pasión por el café de calidad y el servicio amable nos ha convertido en un favorito local. Obtenemos nuestros granos de las mejores plantaciones del mundo, asegurando que cada taza sea una experiencia deliciosa."
              />
            </div>

            <div id="location-hours">
              <LocationHours
                mapImage="images/MAP.webp"
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
