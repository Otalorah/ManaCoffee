import { useAuth } from '../../context/AuthContext';
import { useState, useEffect, useCallback, useReducer } from 'react';
import type { FormEvent, ChangeEvent, JSX } from 'react';
import styles from './Admin.module.css';
import { useNavigate } from 'react-router-dom';

import type { 
    ActiveTab, 
    MenuItem, 
    ApiMessage,
    ReservationItem
} from '../../types/admin'; 
// AÑADIR las nuevas funciones aquí
import { verifyTokenAPI, loadMenuAPI, saveMenuAPI, loadReservationsAPI, saveReservationsAPI } from '../../lib/API'; 
import AdminSidebar from '../../components/sections/Admin/AdminSidebar';
import BuildYourLunchContent from '../../components/sections/Admin/BuildYourLunchContent';
import ReservationsContent from '../../components/sections/Admin/ReservationsContent';
import { menuReducer, initialMenuState } from '../../lib/menuReducer';

const MENU_CACHE_KEY = 'menuManager_menuList';
const RESERVATIONS_CACHE_KEY = 'menuManager_reservationsList'; 

const MenuManager: React.FC = () => {
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    // 1. Estado de UI y Autenticación
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [activeTab, setActiveTab] = useState<ActiveTab>('ArmaTuAlmuerzo'); 
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

    // 2. Estado del Menú y Datos
    const [menuState, dispatch] = useReducer(menuReducer, initialMenuState);
    const { menuList, newIngredient, apiMessage, isSaving } = menuState;

    // 3. Estado de Reservas
    const [reservationsList, setReservationsList] = useState<ReservationItem[]>([]); 
    // Nuevo estado de guardado exclusivo para Reservas
    const [isReservationsSaving, setIsReservationsSaving] = useState<boolean>(false); 


    // --- Manejadores de UI 
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    const handleTabClick = (tab: ActiveTab) => {
        setActiveTab(tab);
        // Limpiar mensajes de API al cambiar de pestaña, excepto si el token falla
        if (apiMessage?.type !== 'error') {
            dispatch({ type: 'SET_API_MESSAGE', payload: null });
        }
        if (window.innerWidth <= 768) {
            setIsSidebarOpen(false);
        }
    };

    // --- Lógica de Reservas
    
    // Función de Edición 
    const handleEditReservation = useCallback((id: string, updatedItem: Partial<ReservationItem>): void => {
        if (updatedItem.date) {
             const date = updatedItem.date.endsWith('Z') ? updatedItem.date : updatedItem.date + ':00Z';
             updatedItem.date = date;
        }

        // Si los elementos no tienen ID, esta lógica podría fallar al buscar 'id'. 
        // Si el 'id' se refiere al índice original, la edición por índice sería muy compleja.
        // Asumiendo que la edición necesita un identificador estable, mantendremos esta lógica si el backend la soporta.
        setReservationsList(prevList =>
            prevList.map(item => (item.id === id ? { ...item, ...updatedItem } as ReservationItem : item))
        );
        dispatch({ type: 'SET_API_MESSAGE', payload: { type: 'warning', text: `Reserva ${updatedItem.name} modificada. **Recuerda Guardar Cambios** para persistir la modificación.` } });
    }, []);

    // MODIFICADO: Eliminación por ÍNDICE (para replicar BuildYourLunchContent)
    const handleDeleteReservation = (index: number): void => {
        
        setReservationsList(prevList => {
            if (index < 0 || index >= prevList.length) {
                console.error('Índice de reserva fuera de límites.');
                return prevList;
            }
            
            // Replicando la lógica de eliminación inmutable por índice:
            const newList = prevList.filter((_, i) => i !== index);
            
            dispatch({ 
                type: 'SET_API_MESSAGE', 
                payload: { type: 'warning', text: `Reserva eliminada localmente (Índice ${index}). **Recuerda Guardar Cambios** para persistir la eliminación.` } 
            });
            
            return newList;
        });
    };
    
    // ACTUALIZADO: Función para Guardar las Reservas (usa saveReservationsAPI)
    const handleSaveReservations = async (): Promise<void> => {
        if (reservationsList.length === 0) {
            const message: ApiMessage = { type: 'warning', text: 'No hay reservas activas para guardar.' };
            dispatch({ type: 'SET_API_MESSAGE', payload: message });
            return;
        }

        dispatch({ type: 'SET_API_MESSAGE', payload: null });
        setIsReservationsSaving(true);

        try {
            // --- LLAMADA A LA API REAL ---
            await saveReservationsAPI(reservationsList); 
            
            // Recargar la lista de reservas para asegurar la coherencia tras el guardado
            await handleLoadReservations(true); 
            
            // Si el guardado fuera exitoso, se actualizaría el estado
            const message: ApiMessage = {
                type: 'success',
                text: `¡Reservas guardadas con éxito! Total de ${reservationsList.length} reservas registradas.`,
            };
            dispatch({ type: 'SET_API_MESSAGE', payload: message });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido al guardar las reservas.';
            dispatch({ type: 'SET_API_MESSAGE', payload: { type: 'error', text: errorMessage } });
        } finally {
            setIsReservationsSaving(false);
        }
    };
    
    // NUEVO: Función para Cargar las Reservas (usa loadReservationsAPI)
    const handleLoadReservations = useCallback(async (forceFetch = false): Promise<void> => {
        if (activeTab !== 'Reservas') return;

        // 1. Intentar cargar desde la caché 
        const cachedData = localStorage.getItem(RESERVATIONS_CACHE_KEY);
        if (cachedData && !forceFetch) {
            try {
                const parsedData: ReservationItem[] = JSON.parse(cachedData);
                setReservationsList(parsedData);
                dispatch({ type: 'SET_API_MESSAGE', payload: { type: 'success', text: 'Reservas cargadas correctamente.' } });
                return; 
            } catch (error) {
                console.error("Error al parsear la caché de reservas:", error);
            }
        }
        
        // 2. Llamada a la API
        dispatch({ type: 'SET_API_MESSAGE', payload: { type: 'info', text: 'Cargando reservas desde el servidor...' } });
        try {
            const data: ReservationItem[] = await loadReservationsAPI(); 
            
            // 3. Guardar en localStorage tras éxito
            localStorage.setItem(RESERVATIONS_CACHE_KEY, JSON.stringify(data));
            
            setReservationsList(data);
            
            dispatch({ type: 'SET_API_MESSAGE', payload: { type: 'success', text: 'Reservas cargadas correctamente desde el servidor.' } });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cargar las reservas.';
            dispatch({ type: 'SET_API_MESSAGE', payload: { type: 'error', text: errorMessage } });
            // Dejar la lista vacía o con los datos de ejemplo si la carga falla
            setReservationsList([]); 
            localStorage.removeItem(RESERVATIONS_CACHE_KEY); 
        }
    }, [activeTab]);
    

    // --- Lógica de Menú (Se mantiene igual)
    const handleLoadMenu = useCallback(async (forceFetch = false): Promise<void> => {
        if (activeTab !== 'ArmaTuAlmuerzo') return;

        // 1. Intentar cargar desde la caché 
        const cachedData = localStorage.getItem(MENU_CACHE_KEY);
        if (cachedData && !forceFetch) {
            try {
                const parsedData: MenuItem[] = JSON.parse(cachedData);
                dispatch({ type: 'SET_MENU_LIST', payload: parsedData });
                
                dispatch({ type: 'SET_API_MESSAGE', payload: { type: 'success', text: 'Menú cargado correctamente.' } });
                return; 
            } catch (error) {
                console.error("Error al parsear la caché:", error);
            }
        }
        
        // 2. Llamada a la API
        dispatch({ type: 'SET_API_MESSAGE', payload: { type: 'info', text: 'Cargando menú desde el servidor...' } });
        try {
            const data: MenuItem[] = await loadMenuAPI(); 
            
            // 3. Guardar en localStorage tras éxito
            localStorage.setItem(MENU_CACHE_KEY, JSON.stringify(data));
            
            dispatch({ type: 'SET_MENU_LIST', payload: data });
            
            dispatch({ type: 'SET_API_MESSAGE', payload: { type: 'success', text: 'Menú cargado correctamente.' } });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cargar el menú.';
            dispatch({ type: 'SET_API_MESSAGE', payload: { type: 'error', text: errorMessage } });
            dispatch({ type: 'SET_MENU_LIST', payload: [] });
            localStorage.removeItem(MENU_CACHE_KEY); 
        }
    }, [activeTab]);


    // El useEffect que verifica token y carga los datos de la pestaña activa
    useEffect(() => {
        const checkTokenAndLoadData = async (): Promise<void> => {
            // Placeholder: Usar verifyTokenAPI en producción
            const response = await verifyTokenAPI(token); 
            setIsAuthenticated(response.success);

            if (response.success) {
                if (activeTab === 'ArmaTuAlmuerzo') {
                    await handleLoadMenu(false); 
                } else if (activeTab === 'Reservas') {
                    // Cargar reservas al activar la pestaña de Reservas
                    await handleLoadReservations(false);
                } else {
                    dispatch({ type: 'SET_API_MESSAGE', payload: null });
                }
            } else {
                const message: ApiMessage = { type: 'error', text: `Error de autenticación: ${response.message}` };
                dispatch({ type: 'SET_API_MESSAGE', payload: message });
                localStorage.removeItem(MENU_CACHE_KEY);
                localStorage.removeItem(RESERVATIONS_CACHE_KEY); // Limpiar caché de reservas
            }
        };

        if (isAuthenticated === null || isAuthenticated === true) {
            checkTokenAndLoadData();
        }
    }, [token, handleLoadMenu, handleLoadReservations, activeTab, isAuthenticated]); // Añadir handleLoadReservations a dependencias

    // ... (El resto de las funciones: handleInputChange, handleAddIngredient, handleDeleteIngredient, handleSaveMenu se mantienen iguales)
    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        
        const parsedValue = name === 'price' ? (value === '' ? 0 : parseInt(value, 10)) : value;
        
        dispatch({
            type: 'UPDATE_NEW_INGREDIENT',
            payload: { name, value: parsedValue },
        });
    }, []);

    const handleAddIngredient = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        dispatch({ type: 'SET_API_MESSAGE', payload: null });

        if (!newIngredient.name || !newIngredient.price) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        const newMenuItem: MenuItem = {
            name: newIngredient.name,
            price: newIngredient.price as number,
        };

        dispatch({ type: 'ADD_INGREDIENT', payload: newMenuItem });
        dispatch({ type: 'RESET_NEW_INGREDIENT' });
    };

    const handleDeleteIngredient = useCallback((index: number): void => {
        dispatch({ type: 'DELETE_INGREDIENT', payload: index });
    }, []); 

    const handleSaveMenu = async (): Promise<void> => {
        if (menuList.length === 0) {
            const message: ApiMessage = { type: 'warning', text: 'No hay elementos para guardar en el menú.' };
            dispatch({ type: 'SET_API_MESSAGE', payload: message });
            return;
        }

        dispatch({ type: 'SET_API_MESSAGE', payload: null });
        dispatch({ type: 'SET_IS_SAVING', payload: true });

        try {
            // Placeholder: Usar saveMenuAPI en producción
            await saveMenuAPI(menuList);
            
            await handleLoadMenu(true); 

            const message: ApiMessage = { 
                type: 'success', 
                text: `¡Menú guardado! Se registraron ${menuList.length} ingredientes.` 
            };
            dispatch({ type: 'SET_API_MESSAGE', payload: message });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido al guardar el menú.';
            dispatch({ type: 'SET_API_MESSAGE', payload: { type: 'error', text: errorMessage } });
        } finally {
            dispatch({ type: 'SET_IS_SAVING', payload: false });
        }
    };


    // --- Renderizado
    
    if (isAuthenticated === null) {
        return (
            <div className={styles['full-page-container']}>
                <p className={styles.loading}>Verificando credenciales... ⏳</p>
            </div>
        );
    }

    if (isAuthenticated === false) {
        return (
            <div className={styles['full-page-container']}>
                <div className={styles['unauthenticated-box']}>
                    <h2 className={styles.header}>Acceso Denegado ❌</h2>
                    <p className={styles.error}>{apiMessage?.text}</p>
                    <p style={{ textAlign: 'center', color: '#6f4e37' }}>Por favor, inicia sesión de nuevo.</p>
                </div>
            </div>
        );
    }

    const renderTabContent = (): JSX.Element => {
        
        switch (activeTab) {
            case 'ArmaTuAlmuerzo':
                return (
                    <BuildYourLunchContent
                        menuList={menuList}
                        newIngredient={newIngredient}
                        apiMessage={apiMessage}
                        isSaving={isSaving}
                        handleInputChange={handleInputChange}
                        handleAddIngredient={handleAddIngredient}
                        handleDeleteIngredient={handleDeleteIngredient}
                        handleSaveMenu={handleSaveMenu}
                        styles={styles}
                    />
                );
            case 'Reservas':
                return (
                    <ReservationsContent
                        reservationsList={reservationsList}
                        // ADVERTENCIA: Se mantiene handleEditReservation con ID, asumiendo que el item tiene un id estable.
                        handleEditReservation={handleEditReservation}
                        // MODIFICADO: Ahora espera y pasa el índice.
                        handleDeleteReservation={handleDeleteReservation}
                        // Nuevos props pasados
                        handleSaveReservations={handleSaveReservations} 
                        isSaving={isReservationsSaving} 
                        apiMessage={apiMessage} 
                        styles={styles}
                    />
                );
            default:
                return (
                    <div className={styles['content-panel']}>
                        <h2 className={styles.subheader}>Pestaña Desconocida</h2>
                        <p className={styles.placeholder}>Selecciona una pestaña válida.</p>
                    </div>
                );
        }
    };

    // --- Estructura Principal del Dashboard ---

    return (
        <div className={styles.dashboard}>
            <AdminSidebar 
                activeTab={activeTab}
                handleTabClick={handleTabClick}
                handleLogout={handleLogout}
                toggleSidebar={toggleSidebar}
                isSidebarOpen={isSidebarOpen}
                styles={styles}
            />
            
            <main className={styles['main-content']}>
                {renderTabContent()}
            </main>
        </div>
    );
};

export default MenuManager;