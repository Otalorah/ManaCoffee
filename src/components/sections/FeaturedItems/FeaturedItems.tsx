import styles from './FeaturedItems.module.css';

interface FeaturedItem {
    image: string;
    title: string;
    description: string;
}

interface FeaturedItemsProps {
    items: FeaturedItem[];
}

const FeaturedItems = ({ items }: FeaturedItemsProps) => {
    return (
        <section className={styles.section}>
            <h2 className={styles.title}>Featured Items</h2>
            <div className={styles.scrollContainer}>
                <div className={styles.itemsContainer}>
                    {items.map((item, index) => (
                        <div key={index} className={styles.itemCard}>
                            <div
                                className={styles.itemImage}
                                style={{ backgroundImage: `url("${item.image}")` }}
                            ></div>
                            <div className={styles.itemInfo}>
                                <p className={styles.itemTitle}>{item.title}</p>
                                <p className={styles.itemDescription}>{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedItems;
