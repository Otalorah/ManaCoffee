import { useState, useMemo } from 'react';
import { CheckCircle2 } from 'lucide-react';
import Header from '../../components/layout/Header/Header';
import Footer from '../../components/layout/Footer/Footer';
import styles from './BuildYourMenu.module.css';
import menuItems from '../../data/menuItems.json';

type DeliveryOption = 'delivery' | 'restaurant';
type PaymentMethod = 'efectivo' | 'nequi' | 'bancolombia';

const BuildYourMenu = () => {
    const [quantities, setQuantities] = useState<Record<number, number>>({});
    const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>('restaurant');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo');
    const [deliveryData, setDeliveryData] = useState({ address: '', phone: '' });
    const [showSuccess, setShowSuccess] = useState(false);

    const handleQuantityChange = (id: number, delta: number) => {
        setQuantities(prev => {
            const current = prev[id] || 0;
            const next = Math.max(0, current + delta);
            return { ...prev, [id]: next };
        });
    };

    const total = useMemo(() => {
        return menuItems.reduce((sum, item) => {
            const qty = quantities[item.id] || 0;
            return sum + (item.price * qty);
        }, 0);
    }, [quantities]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const isValidOrder = useMemo(() => {
        const hasItems = Object.values(quantities).some(qty => qty > 0);
        if (!hasItems) return false;

        if (deliveryOption === 'delivery') {
            return deliveryData.address.trim() !== '' && deliveryData.phone.trim() !== '';
        }

        return true;
    }, [quantities, deliveryOption, deliveryData]);

    const handleCompleteOrder = () => {
        if (!isValidOrder) return;

        try {
            const selectedItems = menuItems
                .filter(item => (quantities[item.id] || 0) > 0)
                .map(item => ({
                    name: item.name,
                    quantity: quantities[item.id],
                    price: item.price,
                    subtotal: item.price * quantities[item.id]
                }));

            const orderData = {
                date: new Date().toISOString(),
                items: selectedItems,
                deliveryOption,
                deliveryData: deliveryOption === 'delivery' ? deliveryData : null,
                paymentMethod,
                total
            };

            console.log('Pedido realizado con éxito:', orderData);

            // Show success alert
            setShowSuccess(true);

            // Reset state after successful order
            setQuantities({});
            setDeliveryData({ address: '', phone: '' });
            setDeliveryOption('restaurant');
            setPaymentMethod('efectivo');

            // Hide success message after 3 seconds
            setTimeout(() => {
                setShowSuccess(false);
            }, 3000);

        } catch (error) {
            console.error('Error al procesar el pedido:', error);
            alert('Ocurrió un error al procesar tu pedido. Por favor intenta nuevamente.');
        }
    };

    return (
        <div className={styles.root}>
            <div className={styles.layoutContainer}>
                <Header />
                <div className={styles.mainContent}>
                    <div className={styles.container}>
                        <h1 className={styles.title}>Arma tu Menú</h1>

                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>1. Elige tus porciones</h2>
                            <div className={styles.menuList}>
                                {menuItems.map(item => (
                                    <div key={item.id} className={styles.menuItem}>
                                        <div className={styles.itemInfo}>
                                            <div className={styles.itemName}>{item.name}</div>
                                            <div className={styles.itemPortion}>{item.portion}</div>
                                            <div className={styles.itemPrice}>{formatCurrency(item.price)}</div>
                                        </div>
                                        <div className={styles.quantityControl}>
                                            <button
                                                className={styles.qtyBtn}
                                                onClick={() => handleQuantityChange(item.id, -1)}
                                                aria-label="Disminuir cantidad"
                                            >
                                                -
                                            </button>
                                            <span className={styles.qtyValue}>{quantities[item.id] || 0}</span>
                                            <button
                                                className={styles.qtyBtn}
                                                onClick={() => handleQuantityChange(item.id, 1)}
                                                aria-label="Aumentar cantidad"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>2. ¿Cómo lo quieres?</h2>
                            <div className={styles.optionsGrid}>
                                <div
                                    className={`${styles.optionCard} ${deliveryOption === 'delivery' ? styles.selected : ''}`}
                                    onClick={() => setDeliveryOption('delivery')}
                                >
                                    <h3>Domicilio</h3>
                                    <p>Te lo llevamos a donde estés</p>
                                </div>
                                <div
                                    className={`${styles.optionCard} ${deliveryOption === 'restaurant' ? styles.selected : ''}`}
                                    onClick={() => setDeliveryOption('restaurant')}
                                >
                                    <h3>Comer en restaurante</h3>
                                    <p>Disfruta de nuestra ambiente</p>
                                </div>
                            </div>

                            {deliveryOption === 'delivery' && (
                                <div className={styles.deliveryForm}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="address">Dirección de entrega</label>
                                        <input
                                            type="text"
                                            id="address"
                                            placeholder="Ej: Calle 123 # 45-67"
                                            value={deliveryData.address}
                                            onChange={(e) => setDeliveryData({ ...deliveryData, address: e.target.value })}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="phone">Número de teléfono</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            placeholder="Ej: 300 123 4567"
                                            value={deliveryData.phone}
                                            onChange={(e) => setDeliveryData({ ...deliveryData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}
                        </section>

                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>3. Método de Pago</h2>
                            <div className={styles.paymentMethods}>
                                <div
                                    className={`${styles.paymentMethod} ${paymentMethod === 'efectivo' ? styles.selected : ''}`}
                                    onClick={() => setPaymentMethod('efectivo')}
                                >
                                    Efectivo
                                </div>
                                <div
                                    className={`${styles.paymentMethod} ${paymentMethod === 'nequi' ? styles.selected : ''}`}
                                    onClick={() => setPaymentMethod('nequi')}
                                >
                                    Nequi
                                </div>
                                <div
                                    className={`${styles.paymentMethod} ${paymentMethod === 'bancolombia' ? styles.selected : ''}`}
                                    onClick={() => setPaymentMethod('bancolombia')}
                                >
                                    Bancolombia
                                </div>
                            </div>
                        </section>

                        <div className={styles.totalSection}>
                            <div className={styles.totalInfo}>
                                <span className={styles.totalLabel}>Total del Plato</span>
                                <span className={styles.totalAmount}>{formatCurrency(total)}</span>
                            </div>
                            <button
                                className={styles.completeButton}
                                onClick={handleCompleteOrder}
                                disabled={!isValidOrder}
                                title={!isValidOrder ? "Selecciona productos y completa los datos de envío si es necesario" : "Finalizar pedido"}
                            >
                                Finalizar Pedido
                            </button>
                        </div>

                        {showSuccess && (
                            <div className={styles.successAlert}>
                                <CheckCircle2 className={styles.alertIcon} />
                                <p>¡Pedido realizado con éxito! Revisa la consola para ver los detalles.</p>
                            </div>
                        )}
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default BuildYourMenu;
