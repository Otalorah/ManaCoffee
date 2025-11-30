import styles from './LocationHours.module.css';

interface LocationHoursProps {
    mapImage: string;
    address: string;
    hours: string;
}

const LocationHours = ({ mapImage, address, hours }: LocationHoursProps) => {
    return (
        <section className={styles.section}>
            <h2 className={styles.title}>Location & Hours</h2>
            <div className={styles.mapContainer}>
                <div
                    className={styles.map}
                    style={{ backgroundImage: `url("${mapImage}")` }}
                ></div>
            </div>
            <p className={styles.info}>{address} {hours}</p>
        </section>
    );
};

export default LocationHours;
