import { useAuth } from '../../context/AuthContext';
import { useState, useEffect, useCallback } from 'react';
import type {FormEvent, ChangeEvent, JSX} from 'react';
import styles from './Admin.module.css'; 

// --- Interfaces and Types ---

interface VerifyTokenResponse {
  success: boolean;
  message: string;
}

interface MenuItem {
  name: string;
  price: number;
  amount: string;
}

interface SaveMenuResponse {
  num_items?: number;
  [key: string]: unknown;
}

interface ApiMessage {
  type: 'success' | 'error' | 'warning' | 'info';
  text: string;
}

type ActiveTab = 'Menu' | 'Reservas';

// --- API Functions ---

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

/**
 * Llama a la API para actualizar el menú 
 * Utiliza la lógica de fetch para POST.
 * @param {Array} menuData - La lista de ingredientes a enviar.
 * @returns {Promise<Object>} La respuesta de la API.
 */
const saveMenuAPI = async (menuData: MenuItem[]): Promise<SaveMenuResponse> => {
    try {
        // Llama al endpoint /menu/update con el método POST
        const response = await fetch('https://apimanacoffee-production.up.railway.app/menu/update', {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json' 
            },
            // Envía los datos del menú en el cuerpo
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
   
        return data;  // Se espera que 'data' sea el array de ítems del menú

    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        
        throw new Error('Error de conexión. Verifica tu internet.');
    }
};

// --- Componente Principal ---

const MenuManager: React.FC = () => {
  const { token } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); 
  const [activeTab, setActiveTab] = useState<ActiveTab>('Menu'); 
  const [menuList, setMenuList] = useState<MenuItem[]>([]);
  
  const [newIngredient, setNewIngredient] = useState<MenuItem>({
    name: '',
    price: 0,
    amount: '',
  });

  const [apiMessage, setApiMessage] = useState<ApiMessage | null>(null); 
  const [isSaving, setIsSaving] = useState<boolean>(false); 

  const handleLoadMenu = useCallback(async (): Promise<void> => {
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
  }, []); 

  // Lógica de Verificación del token Y Carga Inicial del Menú
  useEffect(() => {
    const checkTokenAndLoadMenu = async (): Promise<void> => {
      const response = await verifyTokenAPI(token);
      setIsAuthenticated(response.success);
      
      if (response.success) {
        await handleLoadMenu(); 
      } else {
        setApiMessage({ type: 'error', text: `Error de autenticación: ${response.message}` });
      }
    };
    checkTokenAndLoadMenu();
  }, [token, handleLoadMenu]); 


  // Manejadores de Estado y Lógica

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

    if (!newIngredient.name || !newIngredient.price || !newIngredient.amount) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const newMenuItem: MenuItem = {
      name: newIngredient.name,
      price: newIngredient.price, 
      amount: newIngredient.amount,
    };

    // Solo se añade a la lista local
    setMenuList(prevList => [...prevList, newMenuItem]);
    setNewIngredient({ name: '', price: 0, amount: '' });
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
         // 1. Mensaje de éxito
         setApiMessage({ type: 'success', text: `¡Menú guardado! Se registraron ${response.num_items || menuList.length} ingredientes.` });
         // 2. **Llamada a la recarga para sincronizar la lista con el servidor**
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
      <div className={styles.container}>
        <p className={styles.loading}>Verificando credenciales... ⏳</p>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return (
      <div className={styles.container}>
        <h2 className={styles.header}>Acceso Denegado ❌</h2>
        <p className={styles.error}>{apiMessage?.text}</p>
        <p style={{textAlign: 'center', color: '#6f4e37'}}>Por favor, inicia sesión de nuevo.</p>
      </div>
    );
  }

  // --- Contenido de las Pestañas ---

  const renderTabContent = (): JSX.Element => {
    if (activeTab === 'Reservas') {
      return (
        <div style={{ padding: '20px', textAlign: 'center', color: '#6f4e37' }}>
          <p>Esta es la pestaña de **Reservas**. Contenido pendiente de implementación.</p>
        </div>
      );
    }

    // Pestaña "Menu"
    return (
      <div>
        <h3 className={styles['form-title']}>INGREDIENTES</h3>
        
        {/* Tabla de Ingredientes*/}
        {menuList.length > 0 && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Nombre</th>
                <th className={styles.th}>Precio ($)</th>
                <th className={styles.th}>Porción</th>
                <th className={styles.th}></th> 	
              </tr>
            </thead>
            <tbody>
              {menuList.map((item, index) => (
                <tr key={index}>
                  <td className={styles.td}>{item.name}</td>
                  <td className={styles.td}>{item.price}</td>
                  <td className={styles.td}>{item.amount}</td>
                  <td className={`${styles.td} ${styles.widht}`}>
                    <button 
                      className={styles['delete-button']}
                      onClick={() => handleDeleteIngredient(index)} 
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

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

          <div className={styles['input-group']}>
            <label htmlFor="amount" className={styles.label}>Porción (Ej: "500g", "1L"):</label>
            <input
              id="amount"
              type="text"
              name="amount"
              value={newIngredient.amount}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Ej: 500g, 1 Taza"
              required
            />
          </div>

          <button type="submit" className={styles['add-button']}>
            Agregar ingrediente
          </button>
        </form>
        
        {/* Botón Guardar Menu */}
        <button 
          onClick={handleSaveMenu} 
          className={styles['save-button']} 
          disabled={isSaving}
        >
          {isSaving ? 'Guardando...' : 'Guardar menu'}
        </button>

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
      </div>
    );
  };

  // --- Estructura Principal del Componente ---

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>📋 Gestor de Menús y Reservas</h1>

      {/* Pestañas */}
      <div className={styles['tabs-container']}>
        <button 
          className={`${styles['tab-button']} ${activeTab === 'Menu' ? styles['tab-button-active'] : ''}`} 
          onClick={() => setActiveTab('Menu')}
        >
          Menu
        </button>
        <button 
          className={`${styles['tab-button']} ${activeTab === 'Reservas' ? styles['tab-button-active'] : ''}`} 
          onClick={() => setActiveTab('Reservas')}
        >
          Reservas
        </button>
      </div>

      {/* Contenido de la Pestaña Activa */}
      {renderTabContent()}

    </div>
  );
};

export default MenuManager;