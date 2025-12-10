import styles from './FeaturedItems.module.css';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

import Autoplay from "embla-carousel-autoplay";

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
            <h2 className={styles.title}>Nuestros Destacados</h2>
            <div className={styles.carouselContainer}>
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    plugins={[
                        Autoplay({
                            delay: 3500,
                        }),
                    ]}
                    className={styles.carousel}
                >
                    <CarouselContent className={styles.carouselContent}>
                        {items.map((item, index) => (
                            <CarouselItem key={index} className={styles.carouselItem}>
                                <div className={styles.itemCard}>
                                    <div
                                        className={styles.itemImage}
                                        style={{ backgroundImage: `url("${item.image}")` }}
                                    ></div>
                                    <div className={styles.itemInfo}>
                                        <p className={styles.itemTitle}>{item.title}</p>
                                        <p className={styles.itemDescription}>{item.description}</p>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className={styles.carouselButton} />
                    <CarouselNext className={styles.carouselButton} />
                </Carousel>
            </div>
        </section>
    );
};

export default FeaturedItems;
