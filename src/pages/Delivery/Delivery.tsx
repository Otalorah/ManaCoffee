import { useState, useMemo } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Combobox } from '../../components/ui/combobox';
import Header from '../../components/layout/Header/Header';
import Footer from '../../components/layout/Footer/Footer';
import styles from './Delivery.module.css';
//TODO: Change this to import from the API
import menuData from './menu.json';

// Types
type PaymentMethod = 'efectivo' | 'bancolombia';
type DeliveryType = 'pickup' | 'administration';

interface MenuItem {
    nombre: string;
    descripción?: string | null;
    precio?: string;
    precios?: Array<{ size?: string; base?: string; tamaño?: string; precio: string }>;
    sabores?: string;
}

interface CustomerInfo {
    firstName: string;
    lastName: string;
    phone: string;
}

interface DeliveryInfo {
    address: string;
    additionalInfo: string;
    type: DeliveryType;
}

type MenuSection = MenuItem[] | { [key: string]: MenuSection };

interface SelectedItem {
    category: string;
    name: string;
    description?: string | null;
    quantity: number;
    unitPrice: number;
    priceLabel: string;
    selectedOptions: string[];
    subtotal: number;
}

// Helper to parse price string to number
const parsePrice = (priceStr: string): number => {
    return parseInt(priceStr.replace(/\./g, ''), 10);
};

// Helper to extract options from item data
const extractOptions = (item: MenuItem): string[] => {
    let options: string[] = [];

    // 1. Check 'sabores' field
    if (item.sabores) {
        options = item.sabores.split(',').map(s => s.trim().replace(/\.$/, ''));
    }
    // 2. Check description for "Sabores: ..."
    else if (item.descripción && item.descripción.includes('Sabores:')) {
        const match = item.descripción.match(/Sabores:\s*([^.]+)/i);
        if (match && match[1]) {
            // Remove parentheses if present and split
            const cleanOptions = match[1].replace(/[()]/g, '');
            options = cleanOptions.split(',').map(s => s.trim());
        }
    }
    // 3. Check name for options in parentheses, e.g., "(Res, Cerdo)"
    else if (item.nombre.includes('(') && item.nombre.includes(')')) {
        const match = item.nombre.match(/\(([^)]+)\)/);
        if (match && match[1]) {
            // Filter out common non-option parentheticals if needed
            if (match[1].includes(',') || match[1].includes(' o ')) {
                options = match[1].split(/,| o /).map(s => s.trim());
            }
        }
    }

    return options;
};

const Delivery = () => {
    // State
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [selectedOptions, setSelectedOptions] = useState<Record<string, Record<number, string>>>({});
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo');
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
        firstName: '',
        lastName: '',
        phone: ''
    });
    const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
        address: '',
        additionalInfo: '',
        type: 'pickup'
    });
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Handlers
    const handleQuantityChange = (itemId: string, delta: number) => {
        setErrorMessage(null);
        setQuantities(prev => {
            const current = prev[itemId] || 0;
            const next = Math.max(0, current + delta);

            // Cleanup options if quantity decreases
            if (next < current) {
                setSelectedOptions(prevOpts => {
                    const itemOpts = { ...prevOpts[itemId] };
                    delete itemOpts[next]; // Remove option for the unit that's gone (0-indexed)
                    return { ...prevOpts, [itemId]: itemOpts };
                });
            }

            return { ...prev, [itemId]: next };
        });
    };

    const handleOptionChange = (itemId: string, unitIndex: number, option: string) => {
        setErrorMessage(null);
        setSelectedOptions(prev => ({
            ...prev,
            [itemId]: {
                ...(prev[itemId] || {}),
                [unitIndex]: option
            }
        }));
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    // Calculate total
    const total = useMemo(() => {
        let sum = 0;

        const processItems = (items: MenuSection, prefix: string) => {
            if (Array.isArray(items)) {
                items.forEach((item, index) => {
                    const id = `${prefix}-${index}`;
                    const qty = quantities[id] || 0;
                    if (qty > 0) {
                        let price = 0;
                        if (item.precio) {
                            price = parsePrice(item.precio);
                        } else if (item.precios && item.precios.length > 0) {
                            price = parsePrice(item.precios[0].precio);
                        }
                        sum += price * qty;
                    }
                });
            } else if (typeof items === 'object' && items !== null) {
                Object.keys(items).forEach(key => {
                    processItems((items as Record<string, MenuSection>)[key], `${prefix}-${key}`);
                });
            }
        };

        processItems(menuData.menu as unknown as MenuSection, 'menu');
        return sum > 0 ? sum + 1000 : 0;
    }, [quantities]);

    const isValidOrder = useMemo(() => {
        const hasItems = Object.values(quantities).some(qty => qty > 0);
        const hasCustomerInfo = customerInfo.firstName.trim() && customerInfo.lastName.trim() && customerInfo.phone.trim();
        const hasDeliveryInfo = deliveryInfo.address.trim();

        return hasItems && hasCustomerInfo && hasDeliveryInfo;
    }, [quantities, customerInfo, deliveryInfo]);

    const constructWhatsAppMessage = (
        customer: CustomerInfo,
        delivery: DeliveryInfo,
        payment: PaymentMethod,
        items: SelectedItem[]
    ) => {
        let message = "¡Hola, Mana Coffee!\n\n";
        message += "Quiero hacer un pedido a domicilio con los siguientes datos:\n\n";
        message += "---\n\n";

        // 1. DATOS DEL CLIENTE
        message += "*1. DATOS DEL CLIENTE*\n";
        message += `- *Nombre y Apellido:* ${customer.firstName} ${customer.lastName}\n`;
        message += `- *Teléfono de Contacto:* ${customer.phone}\n\n`;

        // 2. DETALLES DEL PEDIDO
        message += "*2. DETALLES DEL PEDIDO*\n";
        items.forEach(item => {
            let details = "";
            if (item.priceLabel) details += item.priceLabel;
            if (item.selectedOptions && item.selectedOptions.length > 0) {
                if (details) details += ", ";
                details += item.selectedOptions.join(", ");
            }

            message += `- ${item.quantity} x ${item.name}`;
            if (details) {
                message += ` (${details})`;
            }
            message += "\n";
        });
        message += "\n";

        // 3. ENTREGA
        message += "*3. ENTREGA*\n";
        const fullAddress = delivery.additionalInfo
            ? `${delivery.address}, ${delivery.additionalInfo}`
            : delivery.address;
        message += `- *Dirección Completa:* ${fullAddress}\n`;

        const deliveryType = delivery.type === 'pickup'
            ? "Entregar *Directo a la persona*"
            : "Dejar en *Recepción/Portería/Administración*";
        message += `- *Indicación de Entrega:* ${deliveryType}\n\n`;

        // 4. MÉTODO DE PAGO
        message += "*4. MÉTODO DE PAGO*\n";
        const paymentType = payment === 'efectivo'
            ? "Efectivo"
            : "Transferencia Bancaria (Bancolombia)";
        message += `- *Forma de Pago:* ${paymentType}\n\n`;

        message += "---\n\n";
        message += "¡Muchas gracias!";

        return message;
    };

    const handleCompleteOrder = () => {
        setErrorMessage(null);
        // Strict validation for options on submit
        let missingOptions = false;

        const selectedItems: SelectedItem[] = [];
        const processItems = (items: MenuSection, prefix: string, categoryName: string) => {
            if (Array.isArray(items)) {
                items.forEach((item, index) => {
                    const id = `${prefix}-${index}`;
                    const qty = quantities[id] || 0;
                    if (qty > 0) {
                        let price = 0;
                        let priceLabel = '';
                        if (item.precio) {
                            price = parsePrice(item.precio);
                        } else if (item.precios && item.precios.length > 0) {
                            price = parsePrice(item.precios[0].precio);
                            const p = item.precios[0];
                            priceLabel = p.tamaño || p.base || p.size || '';
                        }

                        const options = extractOptions(item);
                        const itemSelectedOptions: string[] = [];

                        if (options.length > 0) {
                            for (let i = 0; i < qty; i++) {
                                const opt = selectedOptions[id]?.[i];
                                if (!opt) {
                                    missingOptions = true;
                                } else {
                                    itemSelectedOptions.push(opt);
                                }
                            }
                        }

                        selectedItems.push({
                            category: categoryName,
                            name: item.nombre,
                            description: item.descripción || item.sabores,
                            quantity: qty,
                            unitPrice: price,
                            priceLabel,
                            selectedOptions: itemSelectedOptions,
                            subtotal: price * qty
                        });
                    }
                });
            } else if (typeof items === 'object' && items !== null) {
                Object.keys(items).forEach(key => {
                    processItems((items as Record<string, MenuSection>)[key], `${prefix}-${key}`, key.replace(/_/g, ' '));
                });
            }
        };

        processItems(menuData.menu as unknown as MenuSection, 'menu', 'General');

        if (missingOptions) {
            setErrorMessage("Por favor selecciona las opciones (sabores, tipo, etc.) para todos los productos.");
            return;
        }

        if (!isValidOrder) return;

        // Construct WhatsApp message
        const message = constructWhatsAppMessage(
            customerInfo,
            deliveryInfo,
            paymentMethod,
            selectedItems
        );

        // Open WhatsApp
        const whatsappUrl = `https://wa.me/573150118386?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');

        setShowSuccess(true);

        // Reset form
        setQuantities({});
        setSelectedOptions({});
        setCustomerInfo({ firstName: '', lastName: '', phone: '' });
        setDeliveryInfo({ address: '', additionalInfo: '', type: 'pickup' });
        setPaymentMethod('efectivo');

        setTimeout(() => setShowSuccess(false), 5000);
    };

    // Recursive renderer for menu items
    const renderMenuSection = (data: MenuSection, prefix: string, title?: string) => {
        if (Array.isArray(data)) {
            return (
                <div className={styles.categorySection} key={prefix}>
                    {title && <h3 className={styles.categoryTitle}>{title}</h3>}
                    <div className={styles.menuList}>
                        {data.map((item, index) => {
                            const id = `${prefix}-${index}`;
                            let displayPrice = item.precio;
                            let hasMultiplePrices = false;

                            if (!displayPrice && item.precios) {
                                hasMultiplePrices = true;
                                displayPrice = item.precios[0].precio; // Show first price
                            }

                            const options = extractOptions(item);
                            const quantity = quantities[id] || 0;

                            return (
                                <div key={id} className={styles.menuItemWrapper}>
                                    <div className={styles.menuItem}>
                                        <div className={styles.itemInfo}>
                                            <div className={styles.itemName}>{item.nombre}</div>
                                            {(item.descripción || item.sabores) && (
                                                <div className={styles.itemDesc}>{item.descripción || item.sabores}</div>
                                            )}
                                            <div className={styles.itemPrice}>
                                                {hasMultiplePrices && <span style={{ fontSize: '0.8em', fontWeight: 'normal' }}>Desde </span>}
                                                ${displayPrice}
                                            </div>
                                        </div>
                                        <div className={styles.quantityControl}>
                                            <button
                                                className={styles.qtyBtn}
                                                onClick={() => handleQuantityChange(id, -1)}
                                                aria-label="Disminuir cantidad"
                                            >
                                                -
                                            </button>
                                            <span className={styles.qtyValue}>{quantity}</span>
                                            <button
                                                className={styles.qtyBtn}
                                                onClick={() => handleQuantityChange(id, 1)}
                                                aria-label="Aumentar cantidad"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Options Selectors */}
                                    {options.length > 0 && quantity > 0 && (
                                        <div className={styles.itemOptions}>
                                            {Array.from({ length: quantity }).map((_, i) => (
                                                <div key={i} className={styles.optionRow}>
                                                    <span className={styles.optionLabel}>#{i + 1}:</span>
                                                    <Combobox
                                                        options={options}
                                                        value={selectedOptions[id]?.[i] || ''}
                                                        onChange={(val) => handleOptionChange(id, i, val)}
                                                        placeholder="Seleccionar..."
                                                        className={styles.optionSelect}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        } else if (typeof data === 'object' && data !== null) {
            return (
                <div key={prefix}>
                    {title && <h3 className={styles.categoryTitle} style={{ fontSize: '1.6rem', borderLeft: 'none', paddingLeft: 0, marginTop: '2rem' }}>{title}</h3>}
                    {Object.keys(data).map(key => (
                        renderMenuSection((data as Record<string, MenuSection>)[key], `${prefix}-${key}`, key.replace(/_/g, ' '))
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className={styles.root}>
            <div className={styles.layoutContainer}>
                <Header />
                <div className={styles.mainContent}>
                    <div className={styles.container}>
                        <h1 className={styles.title}>Domicilios</h1>
                        <p className={styles.description}>Platos frescos y de calidad en cada delivery, tu comida favorita con el sabor de un plato recién hecho en casa.</p>
                        {/* Menu Selection */}
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>1. Selecciona tus productos</h2>
                            {Object.keys(menuData.menu).map(key =>
                                renderMenuSection((menuData.menu as unknown as Record<string, MenuSection>)[key], `menu-${key}`, key.replace(/_/g, ' '))
                            )}
                        </section>

                        {/* Customer Information */}
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>2. Datos del Cliente</h2>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label>Nombres <span className={styles.required}>*</span></label>
                                    <input
                                        type="text"
                                        placeholder="Ej: Juan"
                                        value={customerInfo.firstName}
                                        onChange={e => setCustomerInfo({ ...customerInfo, firstName: e.target.value })}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Apellidos <span className={styles.required}>*</span></label>
                                    <input
                                        type="text"
                                        placeholder="Ej: Pérez"
                                        value={customerInfo.lastName}
                                        onChange={e => setCustomerInfo({ ...customerInfo, lastName: e.target.value })}
                                    />
                                </div>
                                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                    <label>Número Telefónico <span className={styles.required}>*</span></label>
                                    <input
                                        type="tel"
                                        placeholder="Ej: 300 123 4567"
                                        value={customerInfo.phone}
                                        onChange={e => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Delivery Information */}
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>3. Datos de Entrega</h2>
                            <div className={styles.formGrid}>
                                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                    <label>Dirección Completa <span className={styles.required}>*</span></label>
                                    <input
                                        type="text"
                                        placeholder="Ej: Calle 123 # 45-67 Barrio Centro"
                                        value={deliveryInfo.address}
                                        onChange={e => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
                                    />
                                </div>
                                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                    <label>Adicionales (Opcional)</label>
                                    <input
                                        type="text"
                                        placeholder="Ej: Apto 201, Torre 3, Casa esquinera..."
                                        value={deliveryInfo.additionalInfo}
                                        onChange={e => setDeliveryInfo({ ...deliveryInfo, additionalInfo: e.target.value })}
                                    />
                                </div>
                                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                    <label>Tipo de Entrega</label>
                                    <div className={styles.paymentMethods}>
                                        <div
                                            className={`${styles.paymentMethod} ${deliveryInfo.type === 'pickup' ? styles.selected : ''}`}
                                            onClick={() => setDeliveryInfo({ ...deliveryInfo, type: 'pickup' })}
                                        >
                                            Recogido personalmente
                                        </div>
                                        <div
                                            className={`${styles.paymentMethod} ${deliveryInfo.type === 'administration' ? styles.selected : ''}`}
                                            onClick={() => setDeliveryInfo({ ...deliveryInfo, type: 'administration' })}
                                        >
                                            Dejado en administración
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Payment Method */}
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>4. Método de Pago</h2>
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

                        {/* Total & Submit */}
                        <div className={styles.totalSection}>
                            <div className={styles.totalInfo}>
                                <span className={styles.totalLabel}>Total a Pagar</span>
                                <span className={styles.totalAmount}>{formatCurrency(total)}</span>
                            </div>
                            <button
                                className={styles.completeButton}
                                onClick={handleCompleteOrder}
                                disabled={!isValidOrder}
                                title={!isValidOrder ? "Por favor completa todos los campos obligatorios y selecciona al menos un producto" : "Finalizar pedido"}
                            >
                                Finalizar Pedido
                            </button>
                        </div>

                        {errorMessage && (
                            <div className={styles.errorAlert}>
                                <AlertCircle className={styles.alertIcon} />
                                <p>{errorMessage}</p>
                            </div>
                        )}

                        {showSuccess && (
                            <div className={styles.successAlert}>
                                <CheckCircle2 className={styles.alertIcon} />
                                <p>¡Pedido realizado con éxito! Revisa la consola para ver el JSON con los detalles.</p>
                            </div>
                        )}
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default Delivery;
