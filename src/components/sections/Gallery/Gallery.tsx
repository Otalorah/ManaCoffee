import styles from './Gallery.module.css';

interface GalleryProps {
    images: string[];
}

const Gallery = ({ images }: GalleryProps) => {
    return (
        <section className={styles.section}>
            <h2 className={styles.title}>Galería</h2>
            <div className={styles.grid}>
                {images.map((image, index) => (
                    <div key={index} className={styles.imageColumn}>
                        <div
                            className={styles.image}
                            style={{ backgroundImage: `url("${image}")` }}
                        ></div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Gallery;
