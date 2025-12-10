import styles from './OurStory.module.css';

interface OurStoryProps {
    title: string;
    content: string;
}

const OurStory = ({ title, content }: OurStoryProps) => {
    return (
        <div id="#about" className={styles.section}>
            {/* El título ahora está DENTRO del contenedor de la tarjeta */}
            <div className={styles.storyCard}>
                <h2 className={styles.title}>{title}</h2> 
                <p className={styles.content}>{content}</p>
            </div>
        </div>
    );
};

export default OurStory;