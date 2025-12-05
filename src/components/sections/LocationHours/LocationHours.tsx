import styles from './LocationHours.module.css';

interface LocationHoursProps {
    mapImage: string;
    address: string;
    hours: string;
}

const LocationHours = ({ mapImage, address, hours }: LocationHoursProps) => {
    return (
        <section className={styles.section}>
            <h2 className={styles.title}>Ubicación & Horario</h2>
            <div className={styles.mapContainer}>
                <a
                    className={styles.map}
                    style={{ backgroundImage: `url("${mapImage}")` }}
                    href="https://maps.app.goo.gl/FJjPWGYsVq2yv1bXA"
                    target="_blank"
                    rel="noopener noreferrer"
                ></a>
            </div>
            <p className={styles.info}>{address} {hours}</p>
        </section>
    );
};

export default LocationHours;
