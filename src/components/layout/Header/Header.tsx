import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { BookOpen, CalendarCheck, Truck, ChefHat } from 'lucide-react';
import styles from './Header.module.css';

const Header = () => {
    const location = useLocation();
    const { isAuthenticated } = useAuth();

    const isMenuPage = location.pathname === '/menu';

    return (
        <header className={styles.header}>
            <div className={styles.imgContainer}>
                <a href="/">
                    <img className={styles.logoIcon} src="/images/LOGOFNUDE.webp" alt="" />
                </a>
            </div>
            {(!isMenuPage || isAuthenticated) && (
                <>
                    <div className={styles.navContainer}>
                        <nav className={styles.nav}>
                            <Link className={styles.navLink} to="/menu">
                                <BookOpen size={18} />
                                <span>Menu</span>
                            </Link>
                            {isAuthenticated ? (
                                <>
                                    <Link className={`${styles.navLink} ${styles.navLink}`} to="/reservations">
                                        <CalendarCheck size={18} />
                                        <span>Reservaciones</span>
                                    </Link>
                                    <Link className={`${styles.navLink} ${styles.navLink}`} to="/delivery">
                                        <Truck size={18} />
                                        <span>Domicilios</span>
                                    </Link>
                                    <Link className={`${styles.navLink} ${styles.navLink}`} to="/build-your-menu">
                                        <ChefHat size={18} />
                                        <span>Arma tu menu</span>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link className={styles.navLink} to="/reservations">
                                        <CalendarCheck size={18} />
                                        <span>Reservaciones</span>
                                    </Link>
                                    <Link className={styles.navLink} to="/build-your-menu">
                                        <ChefHat size={18} />
                                        <span>Arma tu menu</span>
                                    </Link>
                                    <Link className={styles.navLink} to="/delivery">
                                        <Truck size={18} />
                                        <span>Domicilios</span>
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </>
            )}
        </header>
    );
};

export default Header;
