import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
            const headerOffset = 80; // Height of fixed header + some padding
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (isHomePage) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    const isMenuPage = location.pathname === '/menu';

    return (
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                <Link className={styles.logoText} to="/" onClick={handleLogoClick}>Mana Coffee</Link>
            </div>
            {!isMenuPage && (
                <>
                    <div className={styles.navContainer}>
                        <nav className={styles.nav}>
                            <Link className={styles.navLink} to="/menu">Menu</Link>
                            {isHomePage ? (
                                <>
                                    <a className={`${styles.navLink} ${styles.desktopOnlyLink}`} href="#our-story" onClick={(e) => handleSmoothScroll(e, 'our-story')}>Nuestra Historia</a>
                                    <a className={`${styles.navLink} ${styles.desktopOnlyLink}`} href="#featured-items" onClick={(e) => handleSmoothScroll(e, 'featured-items')}>Nuestros Destacados</a>
                                    <a className={`${styles.navLink} ${styles.desktopOnlyLink}`} href="#gallery" onClick={(e) => handleSmoothScroll(e, 'gallery')}>Galeria</a>
                                    <a className={`${styles.navLink} ${styles.desktopOnlyLink}`} href="#location-hours" onClick={(e) => handleSmoothScroll(e, 'location-hours')}>Ubicación & Horario</a>
                                    <a className={`${styles.navLink} ${styles.desktopOnlyLink}`} href="#contact" onClick={(e) => handleSmoothScroll(e, 'contact')}>Contacto</a>
                                </>
                            ) : (
                                <>
                                    <Link className={`${styles.navLink} ${styles.desktopOnlyLink}`} to="/#our-story">Nuestra Historia</Link>
                                    <Link className={`${styles.navLink} ${styles.desktopOnlyLink}`} to="/#featured-items">Nuestros Destacados</Link>
                                    <Link className={`${styles.navLink} ${styles.desktopOnlyLink}`} to="/#gallery">Galeria</Link>
                                    <Link className={`${styles.navLink} ${styles.desktopOnlyLink}`} to="/#location-hours">Ubicación & Horario</Link>
                                    <Link className={`${styles.navLink} ${styles.desktopOnlyLink}`} to="/#contact">Contacto</Link>
                                </>
                            )}
                        </nav>
                    </div>
                    <div className={styles.buttonContainer}>
                        <button className={styles.ctaButton}>
                            <Link className={styles.ctaButtonText} to='/signup'>Registrate</Link>
                        </button>
                        <button className={styles.isButton}>
                            <Link className={styles.ctaButtonText} to='/login'>Inicia Sesión</Link>
                        </button>
                    </div>
                </>
            )}
        </header>
    );
};

export default Header;
