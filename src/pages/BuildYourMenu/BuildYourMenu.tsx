import { useState, useMemo, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import Header from '../../components/layout/Header/Header';
import Footer from '../../components/layout/Footer/Footer';
import styles from './BuildYourMenu.module.css';

type DeliveryOption = 'delivery' | 'restaurant';
type PaymentMethod = 'efectivo' | 'nequi' | 'bancolombia';

interface MenuItem {
    name: string;
    price: number;
    amount: string;
}

const loadMenuAPI = async (): Promise<MenuItem[]> => {
    try {
        const response = await fetch('https://apimanacoffee-production.up.railway.app/menu/get');
        const data: MenuItem[] = await response.json();
        if (!response.ok) {
            const errorMessage = (data as { detail?: string; error?: string }).detail ||
                (data as { detail?: string; error?: string }).error ||
                `Error ${response.status}: Error desconocido del servidor.`;
            throw new Error(errorMessage);
        }
        console.log('Menú cargado exitosamente:', data);

        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }

        throw new Error('Error de conexión. Verifica tu internet.');
    }
};

const BuildYourMenu = () => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [quantities, setQuantities] = useState<Record<number, number>>({});
    const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>('restaurant');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo');
    const [deliveryData, setDeliveryData] = useState({ address: '', phone: '' });
    const [showSuccess, setShowSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchMenu = async () => {
            try {
                setIsLoading(true);
                const items = await loadMenuAPI();
                setMenuItems(items);
            } catch (error) {
                console.error('Error al cargar el menú:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMenu();
    }, []);

    const handleQuantityChange = (id: number, delta: number) => {
        setQuantities(prev => {
            const current = prev[id] || 0;
            const next = Math.max(0, current + delta);
            return { ...prev, [id]: next };
        });
    };

    const total = useMemo(() => {
        const itemsTotal = menuItems.reduce((sum, item, index) => {
            const qty = quantities[index] || 0;
            return sum + (item.price * qty);
        }, 0);

        return deliveryOption === 'delivery' ? itemsTotal + 1000 : itemsTotal;
    }, [quantities, menuItems, deliveryOption]);

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

    const constructWhatsAppMessage = (
        items: Array<{ name: string; quantity: number; price: number; subtotal: number }>,
        deliveryOption: DeliveryOption,
        deliveryData: { address: string; phone: string },
        paymentMethod: PaymentMethod,
        total: number
    ) => {
        let message = "¡Hola, Mana Coffee!\n\n";
        message += "Quiero hacer un pedido de almuerzo personalizado con los siguientes datos:\n\n";
        message += "---\n\n";

        // 1. DETALLES DEL PEDIDO
        message += "*1. DETALLES DEL PEDIDO*\n";
        items.forEach(item => {
            message += `- ${item.quantity} x ${item.name} (${formatCurrency(item.price)} c/u)\n`;
        });
        message += `\n*Total:* ${formatCurrency(total)}\n\n`;

        // 2. TIPO DE ENTREGA
        message += "*2. TIPO DE ENTREGA*\n";
        if (deliveryOption === 'delivery') {
            message += "- *Tipo:* Domicilio\n";
            message += `- *Dirección:* ${deliveryData.address}\n`;
            message += `- *Teléfono de Contacto:* ${deliveryData.phone}\n`;
        } else {
            message += "- *Tipo:* Comer en restaurante\n\n";
        }

        // 3. MÉTODO DE PAGO
        message += "*3. MÉTODO DE PAGO*\n";
        let paymentType = '';
        switch (paymentMethod) {
            case 'efectivo':
                paymentType = "Efectivo";
                break;
            case 'nequi':
                paymentType = "Nequi";
                break;
            case 'bancolombia':
                paymentType = "Transferencia Bancaria (Bancolombia)";
                break;
        }
        message += `- *Forma de Pago:* ${paymentType}\n\n`;

        message += "---\n\n";
        message += "¡Muchas gracias!";

        return message;
    };

    const handleCompleteOrder = () => {
        if (!isValidOrder) return;

        try {
            const selectedItems = menuItems
                .map((item, index) => ({
                    name: item.name,
                    quantity: quantities[index] || 0,
                    price: item.price,
                    subtotal: item.price * (quantities[index] || 0)
                }))
                .filter(item => item.quantity > 0);

            // Construct WhatsApp message
            const message = constructWhatsAppMessage(
                selectedItems,
                deliveryOption,
                deliveryData,
                paymentMethod,
                total
            );

            // Open WhatsApp
            const whatsappUrl = `https://wa.me/573150118386?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');

            setShowSuccess(true);

            setQuantities({});
            setDeliveryData({ address: '', phone: '' });
            setDeliveryOption('restaurant');
            setPaymentMethod('efectivo');

            setTimeout(() => {
                setShowSuccess(false);
            }, 5000);

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
                        <h1 className={styles.title}>Arma tu Almuerzo</h1>

                        <p className={styles.description}>Una opción personalizada a tu gusto, escoge tus porciones y crea tu almuerzo personalizado.</p>

                        {isLoading ? (
                            <div className={styles.loaderContainer}>
                                <div className={styles.loader}></div>
                                <p>Cargando menú...</p>
                            </div>
                        ) : (
                            <>
                                <section className={styles.section}>
                                    <h2 className={styles.sectionTitle}>1. Elige tus porciones</h2>
                                    <div className={styles.menuList}>
                                        {menuItems.map((item, index) => (
                                            <div key={index} className={styles.menuItem}>
                                                <div className={styles.itemInfo}>
                                                    <div className={styles.itemName}>{item.name}</div>
                                                    <div className={styles.itemPortion}>{item.amount}</div>
                                                    <div className={styles.itemPrice}>{formatCurrency(item.price)}</div>
                                                </div>
                                                <div className={styles.quantityControl}>
                                                    <button
                                                        className={styles.qtyBtn}
                                                        onClick={() => handleQuantityChange(index, -1)}
                                                        aria-label="Disminuir cantidad"
                                                    >
                                                        -
                                                    </button>
                                                    <span className={styles.qtyValue}>{quantities[index] || 0}</span>
                                                    <button
                                                        className={styles.qtyBtn}
                                                        onClick={() => handleQuantityChange(index, 1)}
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
                                            <p className={styles.deliveryNote}>Todo pedido para llevar tiene un costo adicional de $1.000</p>
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
                                        <p>¡Pedido realizado con éxito! Se ha abierto WhatsApp para que puedas enviar tu pedido.</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default BuildYourMenu;