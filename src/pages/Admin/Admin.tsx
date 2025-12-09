import { useAuth } from '../../context/AuthContext';
import { useState, useEffect, useCallback } from 'react';
import type { FormEvent, ChangeEvent, JSX } from 'react';
import styles from './Admin.module.css';
import { useNavigate } from 'react-router-dom';

// --- Interfaces and Types

interface VerifyTokenResponse {
   success: boolean;
   message: string;
}

interface MenuItem {
   name: string;
   price: number;
}

interface SaveMenuResponse {
   num_items?: number;
   [key: string]: unknown;
}

interface ApiMessage {
   type: 'success' | 'error' | 'warning' | 'info';
   text: string;
}

// **MODIFICACIÓN 1: Añadir 'MenuRegular' al tipo ActiveTab**
type ActiveTab = 'MenuRegular' | 'ArmaTuAlmuerzo' | 'Reservas';

// --- API Functions

const verifyTokenAPI = async (token: string | null): Promise<VerifyTokenResponse> => {
   return new Promise((resolve) => {
      setTimeout(() => {
         if (token) {
            resolve({ success: true, message: 'Token verificado correctamente.' });
         } else {
            resolve({ success: false, message: 'Token inválido o expirado.' });
         }
      }, 1000);
   });
};

const saveMenuAPI = async (menuData: MenuItem[]): Promise<SaveMenuResponse> => {
   try {
      const response = await fetch('https://apimanacoffee-production.up.railway.app/menu/update', {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(menuData)
      });

      const data: SaveMenuResponse = await response.json();

      if (!response.ok) {
         const errorMessage = (data as { detail?: string; error?: string }).detail ||
            (data as { detail?: string; error?: string }).error ||
            `Error ${response.status}: Error desconocido del servidor.`;
         throw new Error(errorMessage);
      }

      console.log('Registro exitoso:', data);

      return data;

   } catch (error) {
      if (error instanceof Error) {
         throw error;
      }

      throw new Error('Error de conexión. Verifica tu internet.');
   }
};

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

// --- Componente Principal ---

const MenuManager: React.FC = () => {
   const { token, logout } = useAuth();
   const navigate = useNavigate();
   const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
   // **MODIFICACIÓN 2: Cambiar el estado inicial a la nueva sección**
   const [activeTab, setActiveTab] = useState<ActiveTab>('ArmaTuAlmuerzo');
   const [menuList, setMenuList] = useState<MenuItem[]>([]);

   const [newIngredient, setNewIngredient] = useState<MenuItem>({
      name: '',
      price: 0
   });

   const [apiMessage, setApiMessage] = useState<ApiMessage | null>(null);
   const [isSaving, setIsSaving] = useState<boolean>(false);
   const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

   const handleLogout = () => {
      logout();
      navigate('/login');
   };

   const toggleSidebar = () => {
      setIsSidebarOpen(prev => !prev);
   };

   // Modificamos setActiveTab para cerrar la sidebar en móvil
   const handleTabClick = (tab: ActiveTab) => {
      setActiveTab(tab);
      if (window.innerWidth <= 768) {
         setIsSidebarOpen(false);
      }
   };


   const handleLoadMenu = useCallback(async (): Promise<void> => {
      if (activeTab !== 'ArmaTuAlmuerzo') return;

      setApiMessage({ type: 'info', text: 'Cargando menú...' });
      try {
         const data = await loadMenuAPI();

         setMenuList(data);
         setApiMessage({ type: 'success', text: 'Menú cargado exitosamente.' });
      } catch (error) {
         const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cargar el menú.';
         setApiMessage({ type: 'error', text: errorMessage });
         setMenuList([]);
      }
   }, [activeTab]); // Se añade activeTab como dependencia para el control de carga

   useEffect(() => {
      const checkTokenAndLoadMenu = async (): Promise<void> => {
         const response = await verifyTokenAPI(token);
         setIsAuthenticated(response.success);

         if (response.success) {
            // La carga del menú se maneja dentro de handleLoadMenu y se ejecuta solo si es la pestaña correcta
            if (activeTab === 'ArmaTuAlmuerzo') {
               await handleLoadMenu();
            } else {
               // Limpiar mensaje si no estamos en la pestaña de edición de menú
               setApiMessage(null);
            }
         } else {
            setApiMessage({ type: 'error', text: `Error de autenticación: ${response.message}` });
         }
      };
      // Si no está autenticado, no hacer nada. Si está autenticado, ejecutar la comprobación y carga si aplica
      if (isAuthenticated === null || isAuthenticated === true) {
         checkTokenAndLoadMenu();
      }
      // Dependencias ajustadas
   }, [token, handleLoadMenu, activeTab, isAuthenticated]);


   const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
      const { name, value } = e.target;
      setNewIngredient(prev => ({
         ...prev,
         [name]: name === 'price' ? (value === '' ? 0 : parseInt(value, 10)) : value
      }));
   }, []);

   const handleAddIngredient = (e: FormEvent<HTMLFormElement>): void => {
      e.preventDefault();
      setApiMessage(null);

      if (!newIngredient.name || !newIngredient.price) { // Elimino la validación por 'amount' que no existe en la interfaz MenuItem
         alert('Por favor, completa todos los campos.');
         return;
      }

      const newMenuItem: MenuItem = {
         name: newIngredient.name,
         price: newIngredient.price,
         // amount: newIngredient.amount, // Ya no se usa
      };

      setMenuList(prevList => [...prevList, newMenuItem]);
      setNewIngredient({ name: '', price: 0 }); // Ajusto el reset sin 'amount'
   };

   const handleDeleteIngredient = useCallback((index: number): void => {
      const updatedList = [...menuList];
      updatedList.splice(index, 1);
      setMenuList(updatedList);
      setApiMessage({ type: 'info', text: 'Ingrediente eliminado de la tabla.' });
   }, [menuList]);


   const handleSaveMenu = async (): Promise<void> => {
      if (menuList.length === 0) {
         setApiMessage({ type: 'warning', text: 'No hay elementos para guardar en el menú.' });
         return;
      }

      setApiMessage(null);
      setIsSaving(true);

      try {
         const response = await saveMenuAPI(menuList);

         if (response) {
            setApiMessage({ type: 'success', text: `¡Menú guardado! Se registraron ${response.num_items || menuList.length} ingredientes.` });
            await handleLoadMenu();
         }
      } catch (error) {
         const errorMessage = error instanceof Error ? error.message : 'Error desconocido al guardar el menú.';
         setApiMessage({ type: 'error', text: errorMessage });
      } finally {
         setIsSaving(false);
      }
   };

   // --- Renderizado Condicional de la Autenticación ---

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

   // --- Contenido de las Pestañas ---

   const renderTabContent = (): JSX.Element => {
      if (activeTab === 'MenuRegular') {
         return (
            <div className={styles['content-panel']}>
               <h2 className={styles.subheader}>Gestión de Menú ☕</h2>
               <p className={styles.placeholder}>Contenido de la gestión del menú pendiente de implementación.</p>
            </div>
         );
      }

      if (activeTab === 'Reservas') {
         return (
            <div className={styles['content-panel']}>
               <h2 className={styles.subheader}>Gestión de Reservas 🗓️</h2>
               <p className={styles.placeholder}>Contenido de la gestión de reservas pendiente de implementación.</p>
            </div>
         );
      }

      // Sección "ArmaTuAlmuerzo" 
      return (
         <div className={styles['content-panel']}>
            <h2 className={styles.subheader}>Administración de Arma tu almuerzo 🍱</h2>

            {/* Mensaje de la API*/}
            {apiMessage && (
               <div className={styles.message} style={{
                  backgroundColor: apiMessage.type === 'success' ? '#d9ead3' : (apiMessage.type === 'warning' ? '#fff2cc' : (apiMessage.type === 'error' ? '#f4cccc' : '#e6f7ff')),
                  color: apiMessage.type === 'success' ? '#38761d' : (apiMessage.type === 'warning' ? '#cc9900' : (apiMessage.type === 'error' ? '#cc0000' : '#00529b')),
                  fontWeight: 'bold'
               }}>
                  {apiMessage.text}
               </div>
            )}


            <h3 className={styles['form-title']}>Lista de Ingredientes</h3>

            {/* Tabla de Ingredientes*/}
            {menuList.length > 0 ? (
               <div className={styles['table-container']}>
                  <table className={styles.table}>
                     <thead>
                        <tr>
                           <th className={styles.th}>Nombre</th>
                           <th className={styles.th}>Precio ($)</th>
                           <th className={`${styles.th} ${styles.width}`}>Acción</th>
                        </tr>
                     </thead>
                     <tbody>
                        {menuList.map((item, index) => (
                           <tr key={index}>
                              <td className={styles.td}>{item.name}</td>
                              <td className={styles.td}>{item.price}</td>
                              <td className={`${styles.td} ${styles.width}`}>
                                 <button
                                    className={styles['delete-button']}
                                    onClick={() => handleDeleteIngredient(index)}
                                 >
                                    ❌ Eliminar
                                 </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            ) : (
               <p className={styles.placeholder}>No hay elementos en el menú. ¡Agrega el primero!</p>
            )}

            <h3 className={styles['form-title']}>Agregar Nuevo Ingrediente</h3>

            {/* Formulario */}
            <form onSubmit={handleAddIngredient} className={styles.form}>
               <div className={styles['input-group']}>
                  <label htmlFor="name" className={styles.label}>Nombre:</label>
                  <input
                     id="name"
                     type="text"
                     name="name"
                     value={newIngredient.name}
                     onChange={handleInputChange}
                     className={styles.input}
                     placeholder="Ej: Leche, Azúcar, etc."
                     required
                  />
               </div>

               <div className={styles['input-group']}>
                  <label htmlFor="price" className={styles.label}>Precio (por unidad):</label>
                  <input
                     id="price"
                     type="number"
                     name="price"
                     value={newIngredient.price || ''}
                     onChange={handleInputChange}
                     className={styles.input}
                     placeholder="Ej: 5"
                     min="0"
                     step="1"
                     required
                  />
               </div>

               <button type="submit" className={styles['add-button']}>
                  Agregar
               </button>
            </form>


            {/* Botón Guardar Menu */}
            <div className={styles['save-button-container']}>
               <button
                  onClick={handleSaveMenu}
                  className={styles['save-button']}
                  disabled={isSaving || menuList.length === 0}
               >
                  {isSaving ? 'Guardando...' : 'Guardar Menú en el Servidor'}
               </button>
            </div>
         </div>
      );
   };

   // --- Estructura Principal del Dashboard ---

   return (
      <div className={styles.dashboard}>
         {/* Sidebar (AÑADIMOS CLASE CONDICIONAL) */}
         <aside className={`${styles.sidebar} ${isSidebarOpen ? styles['sidebar-open'] : ''}`}>

            <div className={styles['sidebar-header-group']}>
               <h1 className={styles['sidebar-header']}>Admin Panel</h1>
               {/* NUEVO BOTÓN HAMBURGUESA - Visible en móvil */}
               <button className={styles['hamburger-button']} onClick={toggleSidebar}>
                  {isSidebarOpen ? '✖' : '☰'}
               </button>
            </div>

            {/* El contenido de la navegación y el footer se oculta/muestra con el CSS condicional */}
            <div className={styles['sidebar-content-wrapper']}>
               <nav className={styles['sidebar-nav']}>

                  <button
                     className={`${styles['nav-item']} ${activeTab === 'MenuRegular' ? styles['nav-item-active'] : ''}`}
                     onClick={() => handleTabClick('MenuRegular')}
                  >
                     ☕ Menú
                  </button>

                  <button
                     className={`${styles['nav-item']} ${activeTab === 'ArmaTuAlmuerzo' ? styles['nav-item-active'] : ''}`}
                     onClick={() => handleTabClick('ArmaTuAlmuerzo')}
                  >
                     🍱 Arma tu almuerzo
                  </button>
                  <button
                     className={`${styles['nav-item']} ${activeTab === 'Reservas' ? styles['nav-item-active'] : ''}`}
                     onClick={() => handleTabClick('Reservas')}
                  >
                     🛎️ Reservas
                  </button>
               </nav>

               <div className={styles['sidebar-footer']}>
                  <button
                     className={styles['logout-button']}
                     onClick={handleLogout}
                  >
                     🚪 Cerrar Sesión
                  </button>
               </div>
            </div>
         </aside>

         {/* Contenido Principal */}
         <main className={styles['main-content']}>
            {renderTabContent()}
         </main>
      </div>
   );
};

export default MenuManager;