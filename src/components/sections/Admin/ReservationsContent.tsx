import React, { useState, useMemo, useCallback, type JSX } from 'react';
import type { ReservationsContentProps, ReservationItem } from '../../../types/admin'; 

// --- Utilerías ---

// Función para convertir ISO a datetime-local (YYYY-MM-DDTHH:MM)
const toDateTimeLocal = (isoString: string): string => {
    if (!isoString) return '';
    const date = new Date(isoString);
    // Asegurarse de que la hora esté en UTC para evitar desfases al mostrar el input
    return date.toISOString().substring(0, 16);
};

// Función de formato de fecha
const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' +
               date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
};


// --- Sub-Componentes Modales ---

// 1. Modal de Ver Detalles (Se mantiene igual)
const DetailsReservationModal: React.FC<{
    isModalOpen: boolean;
    detailsItem: ReservationItem | null;
    setIsModalOpen: (isOpen: boolean) => void;
    styles: { readonly [key: string]: string }
}> = ({ isModalOpen, detailsItem, setIsModalOpen, styles }) => {
    
    if (!isModalOpen || !detailsItem) return null;

    return (
        <div className={styles.modal} onClick={() => setIsModalOpen(false)}>
            <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
                <span className={styles['close-button']} onClick={() => setIsModalOpen(false)}>&times;</span>
                <h3 className={styles['modal-title']}>Detalles de Reserva: {detailsItem.name}</h3>
                
                <div className={styles['detail-grid']}>
                    <p className={styles['grid-detail-item']}>🗓️ Fecha y Hora: <span>{formatDate(detailsItem.date)}</span></p>
                    <p className={styles['grid-detail-item']}>👥 Personas: <span>{detailsItem.numberOfPeople}</span></p>
                    <p className={styles['grid-detail-item']}>📞 Teléfono: <span>{detailsItem.phone}</span></p>
                    <p className={styles['grid-detail-item']}>📧 Email: <span>{detailsItem.email}</span></p>
                    <p className={styles['grid-detail-item']}>🗒️ Motivo de la reserva: <span style={{fontWeight: 'normal'}}>{detailsItem.reason || 'N/A'}</span></p>
                    <p className={styles['grid-detail-item']}>🕒 Marca de tiempo de solicitud: <span>{formatDate(detailsItem.timestamp)}</span></p>
                    <p className={styles['grid-detail-item']}>🏷️ Tipo de reserva: <span>{detailsItem.reservationType}</span></p>
                </div>

                <div className={styles['modal-actions']} style={{ justifyContent: 'flex-end', marginTop: '30px' }}>
                    <button type="button" className={`${styles['action-button']} ${styles['cancel-button']}`} onClick={() => setIsModalOpen(false)}>
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};


// 2. Modal de Edición (Corregido: Eliminado useEffect y usa estado inicial garantizado)
const EditReservationModal: React.FC<{
    isModalOpen: boolean;
    // Sabemos que NO es null gracias a la clave y el renderizado condicional en el padre
    editingItem: ReservationItem; 
    setIsModalOpen: (isOpen: boolean) => void;
    setEditingItem: (item: ReservationItem | null) => void;
    handleEditReservation: (id: string, updatedItem: Partial<ReservationItem>) => void;
    styles: { readonly [key: string]: string }
}> = ({  editingItem, setIsModalOpen, setEditingItem, handleEditReservation, styles }) => {
    
    // Si la key en el padre cambia, este componente se remonta, y useState se inicializa correctamente.
    const [modalData, setModalData] = useState<ReservationItem>(editingItem); 

    const handleModalChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setModalData(prev => ({ 
            ...prev, 
            [name]: name === 'numberOfPeople' ? parseInt(value, 10) : value 
        } as ReservationItem));
    }, []);
    
    const handleModalSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        
        // Asumimos que el item tiene un 'id' aunque la eliminación sea por índice,
        // ya que la edición necesita un identificador estable.
        handleEditReservation(modalData.id, modalData); 
        setIsModalOpen(false);
        setEditingItem(null);
    }, [modalData, handleEditReservation, setIsModalOpen, setEditingItem]);

    // Ya no se requiere el check de isModalOpen y editingItem porque lo hace el padre con la key

    return (
        <div className={styles.modal} onClick={() => setIsModalOpen(false)}>
            <div className={`${styles['modal-content']} ${styles['edit-modal-content']}`} onClick={(e) => e.stopPropagation()}>
                <span className={styles['close-button']} onClick={() => setIsModalOpen(false)}>&times;</span>
                <h3 className={styles['modal-title']}>Editar Reserva: {editingItem.name}</h3>
                
                <form onSubmit={handleModalSubmit} className={styles.form}>
                    <div className={styles['input-group']}>
                        <label htmlFor="date" className={styles.label}>Fecha y Hora:</label>
                        <input
                            id="date"
                            type="datetime-local"
                            name="date"
                            value={toDateTimeLocal(modalData.date)} 
                            onChange={handleModalChange}
                            className={styles.input}
                            required
                        />
                    </div>
                    <div className={styles['input-group']}>
                        <label htmlFor="name" className={styles.label}>Nombre:</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={modalData.name}
                            onChange={handleModalChange}
                            className={styles.input}
                            required
                        />
                    </div>
                    <div className={styles['input-group']}>
                        <label htmlFor="numberOfPeople" className={styles.label}>Personas:</label>
                        <input
                            id="numberOfPeople"
                            type="number"
                            name="numberOfPeople"
                            value={modalData.numberOfPeople}
                            onChange={handleModalChange}
                            className={styles.input}
                            min="1"
                            required
                        />
                    </div>
                    <div className={styles['input-group']}>
                        <label htmlFor="phone" className={styles.label}>Teléfono:</label>
                        <input
                            id="phone"
                            type="tel"
                            name="phone"
                            value={modalData.phone}
                            onChange={handleModalChange}
                            className={styles.input}
                            required
                        />
                    </div>
                    <div className={styles['input-group']} style={{ gridColumn: 'span 2' }}>
                        <label htmlFor="email" className={styles.label}>Email:</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={modalData.email}
                            onChange={handleModalChange}
                            className={styles.input}
                            required
                        />
                    </div>
                    <div className={styles['input-group']} style={{ gridColumn: 'span 2' }}>
                        <label htmlFor="reason" className={styles.label}>Motivo:</label>
                        <textarea
                            id="reason"
                            name="reason"
                            value={modalData.reason}
                            onChange={handleModalChange}
                            className={`${styles.input} ${styles.textarea}`}
                            rows={2}
                        />
                    </div>

                    <div className={styles['modal-actions']}>
                        <button type="button" className={`${styles['action-button']} ${styles['cancel-button']}`} onClick={() => setIsModalOpen(false)}>
                            Cancelar
                        </button>
                        <button type="submit" className={`${styles['action-button']} ${styles['save-modal-button']}`}>
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// 3. Tarjeta de Reserva Simplificada (Se mantiene la lógica de pasar el índice)
const ReservationCard: React.FC<{ 
    item: ReservationItem; 
    handleViewDetails: (item: ReservationItem) => void;
    handleEdit: (item: ReservationItem) => void; 
    handleDelete: (index: number) => void; 
    index: number; 
    styles: { readonly [key: string]: string } 
}> = ({ item, handleViewDetails, handleDelete, index, styles }) => {
    
    const dateFormatted = formatDate(item.date);

    return (
        <div className={styles['reservation-card']}> 
            <div className={styles['card-display']}>
                <h4 className={styles['card-title']}>🤵 {item.name}</h4>
                <p className={styles['card-date']}>🗓️ Fecha: <span>{dateFormatted}</span></p>
            </div>
            
            <div className={styles['card-actions']}>
                 <button
                    className={`${styles['action-button']} ${styles['details-button']}`}
                    onClick={() => handleViewDetails(item)}
                >
                    🔍 Ver detalles
                </button>
                <button
                    className={`${styles['action-button']} ${styles['delete-button']}`}
                    onClick={() => handleDelete(index)}
                >
                    ❌ Eliminar
                </button>
            </div>
        </div>
    );
};


// --- Componente Principal Modificado ---
const ReservationsContent: React.FC<ReservationsContentProps> = ({
    reservationsList,
    handleEditReservation,
    handleDeleteReservation,
    handleSaveReservations, 
    isSaving, 
    apiMessage, 
    styles,
}) => {
    const [activeSubTab, setActiveSubTab] = useState<'Pendientes' | 'Historial'>('Pendientes');
    
    // Estado para Modales
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ReservationItem | null>(null);
    const [detailsItem, setDetailsItem] = useState<ReservationItem | null>(null);

    // Lógica principal de filtrado y ordenación
    const { allReservations } = useMemo(() => {
        const all: ReservationItem[] = [...reservationsList];
        return { allReservations: all };
    }, [reservationsList]);


    // Manejadores para la tarjeta
    const handleViewDetailsClick = (item: ReservationItem) => {
        setDetailsItem(item);
        setIsDetailsModalOpen(true);
    };

    const handleEditClick = (item: ReservationItem) => {
        // 🚨 CORRECCIÓN DE MUTACIÓN: Crear una copia superficial inmutable del objeto original
        // para que el modalData no modifique la lista original por referencia.
        setEditingItem({ ...item }); 
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (index: number) => {
        if (window.confirm('⚠️ ¿Estás seguro de que quieres eliminar esta reserva? Esta acción es local hasta que se guarde.')) {
            
            // 1: Obtener la lista filtrada/ordenada que se está mostrando
            const now = new Date();
            const currentList = activeSubTab === 'Pendientes' 
                ? allReservations.filter(item => new Date(item.date) >= now).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                : allReservations.filter(item => new Date(item.date) < now).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                
            const itemToDelete = currentList[index];
            
            // 2: Encontrar el índice original de ese elemento en la lista base (reservationsList)
            // Se asume que itemToDelete tiene propiedades lo suficientemente únicas (name y date) para encontrar su índice.
            const originalIndex = reservationsList.findIndex(item => 
                item.name === itemToDelete.name && item.date === itemToDelete.date
            );
            
            if (originalIndex !== -1) {
                // 3: Llamar al manejador del padre con el índice ORIGINAL
                handleDeleteReservation(originalIndex); 
            } else {
                 console.error("No se pudo encontrar el índice original de la reserva para eliminar.");
            }
        }
    };


    // Contenido de la lista a renderizar
    const now = new Date();
    const pendingReservations = allReservations.filter(item => new Date(item.date) >= now).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const historyReservations = allReservations.filter(item => new Date(item.date) < now).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); 

    const currentList = activeSubTab === 'Pendientes' ? pendingReservations : historyReservations;
    const listTitle = activeSubTab === 'Pendientes' ? 'Reservas Pendientes (Próximas)' : 'Historial de Reservas (Pasadas)';


    const renderReservationList = (): JSX.Element => {
        if (currentList.length === 0) {
            return <p className={styles.placeholder}>No hay {activeSubTab.toLowerCase()} actualmente.</p>;
        }

        return (
            <div className={styles['reservations-list']}>
                {currentList.map((item, index) => (
                    <ReservationCard
                        // Usar el índice como key para la lista filtrada está bien aquí, pero requiere
                        // que la lista sea estable una vez filtrada.
                        key={index} 
                        item={item}
                        handleViewDetails={handleViewDetailsClick}
                        handleEdit={handleEditClick}
                        handleDelete={handleDeleteClick}
                        index={index} 
                        styles={styles}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className={styles['content-panel']}>
            <h2 className={styles.subheader}>Gestión de Reservas 🗓️</h2>
            
            {/* Mensaje de la API */}
            {apiMessage && (
                <div className={styles.message} style={{
                    backgroundColor: apiMessage.type === 'success' ? '#d9ead3' : (apiMessage.type === 'warning' ? '#fff2cc' : (apiMessage.type === 'error' ? '#f4cccc' : '#e6f7ff')),
                    color: apiMessage.type === 'success' ? '#38761d' : (apiMessage.type === 'warning' ? '#cc9900' : (apiMessage.type === 'error' ? '#cc0000' : '#00529b')),
                    fontWeight: 'bold'
                }}>
                    {apiMessage.text}
                </div>
            )}

            {/* Pestañas */}
            <div className={styles['tabs-container']}>
                <button
                    className={`${styles.tab} ${activeSubTab === 'Pendientes' ? styles['tab-active'] : ''}`}
                    onClick={() => setActiveSubTab('Pendientes')}
                >
                    Pendientes ({pendingReservations.length})
                </button>
                <button
                    className={`${styles.tab} ${activeSubTab === 'Historial' ? styles['tab-active'] : ''}`}
                    onClick={() => setActiveSubTab('Historial')}
                >
                    Historial ({historyReservations.length})
                </button>
            </div>
            
            <h3 className={styles['form-title']}>{listTitle}</h3>
            
            {renderReservationList()}
            
            {/* Botón Guardar Cambios */}
            <div className={styles['save-button-container']}>
                <button
                    onClick={handleSaveReservations}
                    className={styles['save-button']}
                    disabled={isSaving || reservationsList.length === 0}
                >
                    {isSaving ? 'Guardando Cambios...' : 'Guardar Cambios'}
                </button>
            </div>
            
            {/* Modal de Edición (¡CORREGIDO con key para forzar re-montaje!) */}
            {isEditModalOpen && editingItem && (
                <EditReservationModal 
                    key={editingItem.timestamp} // Usar el timestamp como clave única
                    isModalOpen={isEditModalOpen}
                    // Forzamos el tipo a ReservationItem ya que el renderizado condicional lo garantiza
                    editingItem={editingItem as ReservationItem} 
                    setIsModalOpen={setIsEditModalOpen}
                    setEditingItem={setEditingItem}
                    handleEditReservation={handleEditReservation}
                    styles={styles}
                />
            )}

            {/* Modal de Ver Detalles */}
            <DetailsReservationModal
                isModalOpen={isDetailsModalOpen}
                detailsItem={detailsItem}
                setIsModalOpen={setIsDetailsModalOpen}
                styles={styles}
            />
        </div>
    );
};

export default ReservationsContent;