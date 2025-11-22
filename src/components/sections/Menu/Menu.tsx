import styles from './Menu.module.css';

export interface MenuItem {
    name: string;
    description: string;
    price: string;
}

interface MenuProps {
    menuItems: MenuItem[];
}

const Menu = ({ menuItems }: MenuProps) => {
    return (
        <section id="menu" className={styles.section}>
            <h2 className={styles.title}>Menu</h2>
            <div className={styles.tableWrapper}>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr className={styles.headerRow}>
                                <th className={styles.headerCell}>Item</th>
                                <th className={styles.headerCell}>Description</th>
                                <th className={styles.headerCell}>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {menuItems.map((item, index) => (
                                <tr key={index} className={styles.row}>
                                    <td className={styles.cellName}>{item.name}</td>
                                    <td className={styles.cellDescription}>{item.description}</td>
                                    <td className={styles.cellPrice}>{item.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default Menu;
