import styles from './Hero.module.css';

interface HeroProps {
    title: string;
    subtitle: string;
    backgroundImage: string
}

const Hero = ({ title, subtitle, backgroundImage}: HeroProps) => {
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div
                    className={styles.hero}
                    style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("${backgroundImage}")` }}
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
