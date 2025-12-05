import styles from './Hero.module.css';

interface HeroProps {
    title: string;
    subtitle: string;
}

const Hero = ({ title, subtitle}: HeroProps) => {
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div
                    className={styles.hero}
                    style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%)` }}
                >
                    <div className={styles.textContainer}>
                        <h1 className={styles.title}>{title}</h1>
                        <h2 className={styles.subtitle}>{subtitle}</h2>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
