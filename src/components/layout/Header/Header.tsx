import { Link } from 'react-router-dom';
import { BookOpen, CalendarCheck, Truck, ChefHat } from 'lucide-react';
import styles from './Header.module.css';

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.imgContainer}>
                <a href="/">
                    <img className={styles.logoIcon} src="/images/LOGOFNUDE.webp" alt="" />
                </a>
            </div>
            <div className={styles.navContainer}>
                <nav className={styles.nav}>
                    <Link className={styles.navLink} to="/menu">
                        <BookOpen size={18} />
                        <span>Nuestro menú</span>
                    </Link>
                    <Link className={styles.navLink} to="/reservations">
                        <CalendarCheck size={18} />
                        <span>Reservaciones</span>
                    </Link>
                    <Link className={styles.navLink} to="/build-your-menu">
                        <ChefHat size={18} />
                        <span>Arma tu almuerzo</span>
                    </Link>
                    <Link className={styles.navLink} to="/delivery">
                        <Truck size={18} />
                        <span>Domicilios</span>
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;
