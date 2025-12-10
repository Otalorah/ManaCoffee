import styles from './Hero.module.css';

interface HeroProps {
    title: string;
    subtitle: string;
}

const Hero = ({ title, subtitle}: HeroProps) => {
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.hero}>
                    <div className={styles.textContainer}>
                        <h1 className={styles.title}>{title}</h1>
                        <p className={styles.subtitle}>{subtitle}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;