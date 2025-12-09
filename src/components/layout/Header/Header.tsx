import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CalendarCheck, Truck, ChefHat, Menu, X } from 'lucide-react';
import styles from './Header.module.css';

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        window.scrollTo(0, 0);
    };

    return (
        <header className={styles.header}>
            <div className={styles.imgContainer}>
                <a href="/">
                    <img className={styles.logoIcon} src="/images/Blanco SF.webp" alt="" />
                </a>
            </div>

            {/* Hamburger Menu Button - Only visible on small screens */}
            <button
                className={styles.hamburgerButton}
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Desktop Navigation */}
            <div className={styles.navContainer}>
                <nav className={styles.nav}>
                    <Link className={styles.navLink} to="/menu" onClick={() => window.scrollTo(0, 0)}>
                        <BookOpen size={18} />
                        <span>Nuestro menú</span>
                    </Link>
                    <Link className={styles.navLink} to="/reservations" onClick={() => window.scrollTo(0, 0)}>
                        <CalendarCheck size={18} />
                        <span>Reservaciones</span>
                    </Link>
                    <Link className={styles.navLink} to="/build-your-menu" onClick={() => window.scrollTo(0, 0)}>
                        <ChefHat size={18} />
                        <span>Arma tu almuerzo</span>
                    </Link>
                    <Link className={styles.navLink} to="/delivery" onClick={() => window.scrollTo(0, 0)}>
                        <Truck size={18} />
                        <span>Domicilios</span>
                    </Link>
                </nav>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
                <div className={styles.mobileMenu}>
                    <nav className={styles.mobileNav}>
                        <Link className={styles.mobileNavLink} to="/menu" onClick={closeMobileMenu}>
                            <BookOpen size={20} />
                            <span>Nuestro menú</span>
                        </Link>
                        <Link className={styles.mobileNavLink} to="/reservations" onClick={closeMobileMenu}>
                            <CalendarCheck size={20} />
                            <span>Reservaciones</span>
                        </Link>
                        <Link className={styles.mobileNavLink} to="/build-your-menu" onClick={closeMobileMenu}>
                            <ChefHat size={20} />
                            <span>Arma tu almuerzo</span>
                        </Link>
                        <Link className={styles.mobileNavLink} to="/delivery" onClick={closeMobileMenu}>
                            <Truck size={20} />
                            <span>Domicilios</span>
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
