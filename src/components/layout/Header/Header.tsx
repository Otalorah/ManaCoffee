import styles from './Header.module.css';

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                <a className={styles.logoText} href="hero">Mana Coffee</a>
            </div>
            <div className={styles.navContainer}>
                <nav className={styles.nav}>
                    <a className={styles.navLink} href="menu">Menu</a>
                    <a className={styles.navLink} href="about">Nuestra Historia</a>
                    <a className={styles.navLink} href="location">Ubicación & Horario</a>
                    <a className={styles.navLink} href="contact">Contacto</a>
                </nav>
                <button className={styles.ctaButton}>
                    <span className={styles.ctaButtonText}>Ordenar Online</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
