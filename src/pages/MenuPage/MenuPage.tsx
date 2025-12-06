import { useState, useEffect } from 'react';
import Header from '../../components/layout/Header/Header';
import Footer from '../../components/layout/Footer/Footer';
import styles from './MenuPage.module.css';

const MenuPage = () => {
    // Ruta del PDF - Cambia esta ruta cuando tengas el PDF real
    const PDF_PATH = '/menu.pdf';
    const [pdfError, setPdfError] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className={styles.root}>
            <div className={styles.layoutContainer}>
                <Header />
                <div className={styles.mainContent}>
                    <div className={styles.contentContainer}>
                        <div className={styles.menuHeader}>
                            <h1 className={styles.title}>Nuestro Menú</h1>
                            <p className={styles.subtitle}>
                                Descubre nuestra selección de cafés especiales, bebidas artesanales y deliciosos alimentos
                            </p>
                        </div>

                        <div className={styles.pdfContainer}>
                            {!pdfError ? (
                                <iframe
                                    src={PDF_PATH}
                                    className={styles.pdfViewer}
                                    title="Menú de Mana Coffee"
                                    onError={() => setPdfError(true)}
                                />
                            ) : (
                                <div className={styles.pdfPlaceholder}>
                                    <div className={styles.placeholderIcon}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 256 256">
                                            <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-42.34-61.66a8,8,0,0,1,0,11.32l-24,24a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L120,164.69V120a8,8,0,0,1,16,0v44.69l10.34-10.35A8,8,0,0,1,157.66,154.34Z"></path>
                                        </svg>
                                    </div>
                                    <h2 className={styles.placeholderTitle}>Menú Próximamente</h2>
                                    <p className={styles.placeholderText}>
                                        El menú en PDF estará disponible pronto.
                                    </p>
                                    <p className={styles.placeholderNote}>
                                        Para agregar el menú, coloca el archivo PDF en <code>/public/menu.pdf</code>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div id="contact">
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default MenuPage;
