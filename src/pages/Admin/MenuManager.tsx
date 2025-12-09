import { useAuth } from '../../context/AuthContext';
import { useState, useEffect, useCallback, useReducer } from 'react';
import type { FormEvent, ChangeEvent, JSX } from 'react';
import styles from './Admin.module.css';
import { useNavigate } from 'react-router-dom';

import type { 
    ActiveTab, 
    MenuItem, 
    ApiMessage 
} from '../../types/admin'; 
import { verifyTokenAPI, loadMenuAPI, saveMenuAPI } from '../../lib/API';
import AdminSidebar from '../../components/sections/Admin/AdminSidebar';
import BuildYourLunchContent from '../../components/sections/Admin/BuildYourLunchContent';
import { menuReducer, initialMenuState } from '../../lib/menuReducer';

const MENU_CACHE_KEY = 'menuManager_menuList';

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
        if (window.innerWidth <= 768) {
            setIsSidebarOpen(false);
        }
    };

    // --- Manejadores de API y Lógica de Datos

    const handleLoadMenu = useCallback(async (forceFetch = false): Promise<void> => {
        if (activeTab !== 'ArmaTuAlmuerzo') return;

        // 1. Intentar cargar desde la caché 
        const cachedData = localStorage.getItem(MENU_CACHE_KEY);
        if (cachedData && !forceFetch) {
            try {
                const parsedData: MenuItem[] = JSON.parse(cachedData);
                dispatch({ type: 'SET_MENU_LIST', payload: parsedData });
                
                dispatch({ type: 'SET_API_MESSAGE', payload: { type: 'success', text: 'Menú cargado correctamente.' } });
                return; // Termina si se cargó desde la caché
            } catch (error) {
                console.error("Error al parsear la caché:", error);
            }
        }
        
        // 2. Llamada a la API
        dispatch({ type: 'SET_API_MESSAGE', payload: { type: 'info', text: 'Cargando menú desde el servidor...' } });
        try {
            const data = await loadMenuAPI();
            
            // 3. Guardar en localStorage tras éxito
            localStorage.setItem(MENU_CACHE_KEY, JSON.stringify(data));
            
            dispatch({ type: 'SET_MENU_LIST', payload: data });
            
            dispatch({ type: 'SET_API_MESSAGE', payload: { type: 'success', text: 'Menú cargado correctamente.' } });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cargar el menú.';
            dispatch({ type: 'SET_API_MESSAGE', payload: { type: 'error', text: errorMessage } });
            dispatch({ type: 'SET_MENU_LIST', payload: [] });
            localStorage.removeItem(MENU_CACHE_KEY); // Limpiar caché si falla
        }
    }, [activeTab]);

    // El useEffect que verifica token y carga el menú
    useEffect(() => {
        const checkTokenAndLoadMenu = async (): Promise<void> => {
            const response = await verifyTokenAPI(token);
            setIsAuthenticated(response.success);

            if (response.success) {
                if (activeTab === 'ArmaTuAlmuerzo') {
                    await handleLoadMenu(false); 
                } else {
                    dispatch({ type: 'SET_API_MESSAGE', payload: null });
                }
            } else {
                const message: ApiMessage = { type: 'error', text: `Error de autenticación: ${response.message}` };
                dispatch({ type: 'SET_API_MESSAGE', payload: message });
                localStorage.removeItem(MENU_CACHE_KEY);
            }
        };

        if (isAuthenticated === null || isAuthenticated === true) {
            checkTokenAndLoadMenu();
        }
    }, [token, handleLoadMenu, activeTab, isAuthenticated]);


    // handleInputChange
    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        
        const parsedValue = name === 'price' ? (value === '' ? 0 : parseInt(value, 10)) : value;
        
        dispatch({
            type: 'UPDATE_NEW_INGREDIENT',
            payload: { name, value: parsedValue },
        });
    }, []);

    // handleAddIngredient
    const handleAddIngredient = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        dispatch({ type: 'SET_API_MESSAGE', payload: null });

        if (!newIngredient.name || !newIngredient.price) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        const newMenuItem: MenuItem = {
            name: newIngredient.name,
            price: newIngredient.price,
        };

        dispatch({ type: 'ADD_INGREDIENT', payload: newMenuItem });
        dispatch({ type: 'RESET_NEW_INGREDIENT' });
    };

    // handleDeleteIngredient
    const handleDeleteIngredient = useCallback((index: number): void => {
        dispatch({ type: 'DELETE_INGREDIENT', payload: index });
    }, []); 

    // handleSaveMenu 
    const handleSaveMenu = async (): Promise<void> => {
        if (menuList.length === 0) {
            const message: ApiMessage = { type: 'warning', text: 'No hay elementos para guardar en el menú.' };
            dispatch({ type: 'SET_API_MESSAGE', payload: message });
            return;
        }

        dispatch({ type: 'SET_API_MESSAGE', payload: null });
        dispatch({ type: 'SET_IS_SAVING', payload: true });

        try {
            await saveMenuAPI(menuList);
            
            // Forzar una nueva carga
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
        
        // Sección "ArmaTuAlmuerzo"
        return activeTab === 'ArmaTuAlmuerzo' ? (
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
        ) : (
            <div className={styles['content-panel']}>
                 <h2 className={styles.subheader}>{activeTab === 'MenuRegular' ? 'Gestión de Menú ☕' : 'Gestión de Reservas 🗓️'}</h2>
                 <p className={styles.placeholder}>Contenido de la gestión de {activeTab} pendiente de implementación.</p>
             </div>
        )
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