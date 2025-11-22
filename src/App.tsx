import Header from './components/layout/Header/Header';
import Footer from './components/layout/Footer/Footer';
import Hero from './components/sections/Hero/Hero';
import OurStory from './components/sections/OurStory/OurStory';
import FeaturedItems from './components/sections/FeaturedItems/FeaturedItems';
import Gallery from './components/sections/Gallery/Gallery';
import Menu from './components/sections/Menu/Menu';
import LocationHours from './components/sections/LocationHours/LocationHours';
import styles from './App.module.css';

function App() {
  // Featured Items Data
  const featuredItems = [
    {
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAVLNwf_Ogprk79wgV531iMetUDm_m4fB_lXCjRfu8ffZm1EoBEofOZ6AWqNqM6OjrxZjvbRq2QvsaL8WQ_igxkMzpWavc1TuJ_x-dlsNGk4cw8Sf4LjzLcaHJ3X5tJbYevVNX8q_BwfCAIw1yjY4WB2BMepP_oqizkLnrQiosk-dpfj5e0zIlTH4umW8XjKe369qIezbTPx4gLYw51oymYAC3bSb3FKr9saEKB4eRjZxlEMN-R8TmOrF5D_-4eCSEPE1Pna9wKdg",
      title: "Signature Latte",
      description: "Our signature latte with a unique blend of espresso and steamed milk."
    },
    {
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAh58CQgJ7PiBPBQScFsvcIf0a1dnmQwGl4fDTRBa2DpEcnx4rhMc87-uUY1ri_3XPu_zetEuKiQR3vACET3Dh6b0BAI2pzKawkbg_FYAwdFKr6jVbNLfp5SWS34skKecChKeUI42_KLVSp-ociVN5nymrleY00DOfpA0sHoAI2ZFCOdfSnjQ4dLGGc7fmVd4Jushp1oL5PnNQppsLeOEHnKbyZ9EsDvdVAipX9oxy4IPeaIIh1rMhRGsfEE_Z3H7QGThS621L4YQ",
      title: "Freshly Baked Croissant",
      description: "Flaky and buttery croissants baked fresh daily."
    },
    {
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxm0KwUVKNX49NuTZbb5A5SObeBsyMDUSQi_Bv5NeCoNIbnDK1RmtiaS2LODdlq0NyP47njPcpuQkZpIMXi93XZ8zq0scyaF0b9qGcKN21KwRIknzPevkPYAagNQrmD-hf6L6l740DAIrb77xVKSYTa1cCu56bvfbo9agQkvoPrN1s9DKd-u-rMsgK70-Y-KgjpVO4mEgGSTefaIMOyxLobM12qXKvpxa001IhK2LkcH8duR9QluR1A4jC3Z_4IoZBTV8m5V6R2g",
      title: "Iced Coffee",
      description: "Refreshing iced coffee, perfect for a warm day."
    }
  ];

  // Gallery Images
  const galleryImages = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDVRN9JOBAr6gunEvDXTkomTPc71C-ySnFWcB2uk5IiGg3QErilbTrOJlKBrE8Jdz6xFc1ACmNfxmREwBibjTnOslhMGt8nK1TALYNTb2XhMAIs48e5PlOp05UPT9GjLKcV7G2y3s0fYHl7xBIgI4EnHf3LnS-RAULNH8p3SnQhTTuFwv-y2GlNC-P8N_kMTqQcua46xHZdDKRqsb0OhhxGYDrRBd9DusQVT-k3liKMe8yyKWbd9DpppoxJ1WqE6IYHQ08StiMDvw",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDoRZcOonJqyETB0jVryYr-i2zHWg6GpINStIu0Z_0rhjZCXzSulTfy7_1UsCppKn-suPf3u7amCrjOso4h7a-o5MW5QggR0TfvcrBtiRqCjReTtrw63TKK55NnGVIlzKQh-FNMEIAzzPpbE3F1tKbhs0blm8XKU3_InMCbF63IApiYkXZRVO3BAw45aaoJIWGQi32esJoDKbmOrNlTjBhLfY1Z1i9d4QehF2C24x5F68zhtAI5PneKaKoTM7QSDUQo-wyvpq9Llw",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAhb0_xi5dJ9wxPTU23ChbzETs0J_ZA3Tl6Bp6LtsvCgywpo-y5gBxHUNxmQiF96oO1DyEWGZFpFIa2SB0oZg6dWXIcpXdg-dqIWgKBLqG-FY1KjosRFtn_bvUtEIB1XyY-J2kTxrQab88RQFX-oVz2VVZIsna60VxgbOzPmQ0pBWYTa1GvfrIrQbS9yVcIRPnCfXttnXievORA8EPBqonFVK9D36k7D2GwpLlT3iEm_4GAL59iwts2F7GGBx76fdkc_H8roBXoCA",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBIGMXTeC1SaVcx4MsH9LX9fKYJu_DbtNj_P-Vr-JFptnS-6TahsAT-73Nrb2Jr5DLWCbrrx1ohvnWQduxNH9UqmRUm6zy2eSRjgY6SyyG27rI8Q8QrlU1VWuaTvoNuh5Tw1olEPDN_RbZyaWn6_SV0wmA-jNMODo3XQ3cOBlt1IdN_pRSOz1_Z4Z6m0STCdjDp8tgZOFPzflSDMG8PmmmO3lUI6hBSgCVA8eD0BEef8YIkMwxUEW3_4oeevtPXqjhvKek5hVfv-g",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuARpeiBX_nxQjbYA80q3OSbcGPkCaO_M2N43i8yDclT1BP9wyvOwX_kvu3tRbBi-QCBKuO1Gt-odqNZAiRaTCUX_gyGVe6eVnI6VVwooCt1NW7rhcXt7fAOl530hGnSFTnPDrp7i9bdSxhygcflrdAmCY41Ui02tVrBl5o1eTUwV82s4Sp1Xg1JYqAyX9n3qSVpagcMeP-EVPUU_7PaVd718Pi2UXrwCdHd0-1OqJtJqCs6OFmfls_ucTeKMzIuPc--SEg_OHMLdQ",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCsIjUv04QqesB9nnoxLF2s93JFiwR_rafFQFLtwCBXcMll0_Sucz1qTh0ikMkXHNVU3tmQy3JnkDxYtCf-M7isz9Wb4eqNTpeUaqzFCxIU1Wi5Q5gk53IyWzQE3UGfemBIXZD8jEqMHzFIoR1od2PJd6KNMy0SyXYHQ4vWteeLFQWhvAUdVJqbrH0m4chnM1mMraRib4hS7kaVo_2Q8cT3d6licSJ9bLbyRVt2IezdhNN6puXHQgvMageGp9rvAs633yYG8V7vBA"
  ];

  // Menu Items
  const menuItems = [
    {
      name: "Espresso",
      description: "Strong and concentrated coffee brewed by forcing hot water through finely-ground coffee beans.",
      price: "$2.50"
    },
    {
      name: "Cappuccino",
      description: "Espresso with steamed milk and a layer of foamed milk.",
      price: "$3.50"
    },
    {
      name: "Latte",
      description: "Espresso with steamed milk and a thin layer of foam.",
      price: "$4.00"
    },
    {
      name: "Iced Coffee",
      description: "Chilled coffee served over ice.",
      price: "$3.00"
    },
    {
      name: "Pastry",
      description: "Freshly baked pastry of the day.",
      price: "$2.00"
    }
  ];

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

            <OurStory
              title="Our Story"
              content="Established in 2010, Coffee Corner has been a beloved gathering place for coffee enthusiasts and casual visitors alike. Our passion for quality coffee and friendly service has made us a local favorite. We source our beans from the best farms around the world, ensuring every cup is a delightful experience."
            />

            <FeaturedItems items={featuredItems} />

            <Gallery images={galleryImages} />

            <Menu menuItems={menuItems} />

            <LocationHours
              mapImage="https://lh3.googleusercontent.com/aida-public/AB6AXuDNASFpVA7gAYyLiXHRMq4fRYS7ROwekzD3vmcdxbdNgw6gc7H-wiPOHP5P8qO4Qr3gqCcSLD3re9Zo34mnejXUHX5V75aLGy-cQUHEs_aScEpDhQ-5CZ1-QuZuejz3gEpkOHd6azin_yeBBE7YIX4Wfl_-N2UGkhTcQx39WnKp_nY03YDaYNaW2knbShMb5WbEsmhA36fgLeWT6Zj6SNx72vCvZ3BtmHiKuXOopTKfoxJt5Q3Jaww0SKgdA3m_7QPFrcfgLqrnjg"
              address="123 Main Street, Anytown, USA"
              hours="Monday - Friday: 7 AM - 7 PM Saturday - Sunday: 8 AM - 5 PM"
            />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
