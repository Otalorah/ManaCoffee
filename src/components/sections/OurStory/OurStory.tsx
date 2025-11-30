import styles from './OurStory.module.css';

interface OurStoryProps {
    title: string;
    content: string;
}

const OurStory = ({ title, content }: OurStoryProps) => {
    return (
        <div id="#about" className={styles.section}>
            <section className={styles.section}>
                <h2 className={styles.title}>{title}</h2>
                <p className={styles.content}>{content}</p>
            </section>
        </div>
    );
};

export default OurStory;
