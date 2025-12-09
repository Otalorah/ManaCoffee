import styles from './LocationHours.module.css';

interface LocationHoursProps {
    mapImage: string;
    address: string;
}

const LocationHours = ({ mapImage, address }: LocationHoursProps) => {
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
            <p className={styles.ubicationInfo}>{address}</p>

            <div className={styles.hoursContainer}>
                <div className={styles.servicesGrid}>
                    <div className={styles.serviceCard}>
                        <span className={styles.serviceIcon}>🌅</span>
                        <h3 className={styles.serviceName}>Desayunos</h3>
                        <p className={styles.serviceTime}>7:30 am - 9:00 am</p>
                    </div>
                    <div className={styles.serviceCard}>
                        <span className={styles.serviceIcon}>🍽️</span>
                        <h3 className={styles.serviceName}>Almuerzos</h3>
                        <p className={styles.serviceTime}>12:00 m - 3:00 pm</p>
                    </div>
                    <div className={styles.serviceCard}>
                        <span className={styles.serviceIcon}>🍔</span>
                        <h3 className={styles.serviceName}>Comida Rápida</h3>
                        <p className={styles.serviceTime}>5:00 pm - 9:00 pm</p>
                    </div>
                    <div className={styles.serviceCard}>
                        <span className={styles.serviceIcon}>☕</span>
                        <h3 className={styles.serviceName}>Cafetería</h3>
                        <p className={styles.serviceTime}>Todo el día</p>
                    </div>
                </div>

                <div className={styles.generalHours}>
                    <span className={styles.hoursLabel}>Horario de Servicio:</span>
                    <span className={styles.hoursValue}>7:30 am - 9:00 pm</span>
                </div>
            </div>
        </section>
    );
};

export default LocationHours;
