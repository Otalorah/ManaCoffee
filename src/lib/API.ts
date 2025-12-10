import type { UserRegistrationData, ApiResponse, EmailData, CodeData, PasswordUpdateData } from '../types/api';
import type { 
    MenuItem, 
    VerifyTokenResponse, 
    SaveMenuResponse, 
    ReservationItem, 
    SaveReservationsResponse // <-- Nuevo tipo
} from '../types/admin';

/**
 * URL base de la API
 */
const API_BASE_URL = 'https://apimanacoffee-production.up.railway.app';

/**
 * Registra un nuevo usuario en la API
 * @param userData - Datos del usuario a registrar
 * @returns Promise con la respuesta de la API
 * @throws Error si el registro falla
 */
export const registerUser = async (userData: UserRegistrationData): Promise<ApiResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/user/create`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(userData)
        });

        const data: ApiResponse = await response.json();

        if (!response.ok) {
            // Lanza un error con el mensaje de la API o uno genérico
            throw new Error(data.detail || data.error || 'Error en el registro');
        }

        console.log('Registro exitoso:', data);
        return data;

    } catch (error) {
        // Re-lanza el error para que sea manejado por el hook
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Error de conexión. Verifica tu internet.');
    }
};



/**
 * Manda un correo
 * @param emailUser - Correo del usuario
 * @returns Promise con la respuesta de la API
 * @throws Error si el envio falla
 */
export const sendEmail = async (emailUser: EmailData): Promise<ApiResponse> => {

    try {
        const response = await fetch(`${API_BASE_URL}/email/`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(emailUser)
        });

        const data: ApiResponse = await response.json();

        if (!response.ok) {
            // Lanza un error con el mensaje de la API o uno genérico
            throw new Error(data.detail || data.error);
        }

        console.log('Registro exitoso:', data);
        return data;

    } catch (error) {

        // Re-lanza el error para que sea manejado por el hook
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Error de conexión. Verifica tu internet.');
    }
};


/**
 * Actualiza la contraseña
 * @param newPassword - nueva contraseña
 * @returns Promise con la respuesta de la API
 * @throws Error si el envio falla
 */
export const updatePassword = async (newPassword: PasswordUpdateData): Promise<ApiResponse> => {

    console.log(newPassword);

    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${API_BASE_URL}/user/password`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newPassword)
        });

        const data: ApiResponse = await response.json();

        if (!response.ok) {
            // Lanza un error con el mensaje de la API o uno genérico
            throw new Error(data.detail || data.error);
        }
        console.log('Registro exitoso:', data);

        return data;

    } catch (error) {

        // Re-lanza el error para que sea manejado por el hook
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Error de conexión. Verifica tu internet.');
    }
};


/**
 * Manda el código de verificación
 * @param codeUser - Código y correo del usuario
 * @returns Promise con la respuesta de la API
 * @throws Error si el envio falla
 */
export const sendCode = async (codeUser: CodeData): Promise<ApiResponse> => {

    try {
        const response = await fetch(`${API_BASE_URL}/email/code`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(codeUser)
        });

        const data: ApiResponse = await response.json();

        if (!response.ok) {
            // Lanza un error con el mensaje de la API o uno genérico
            throw new Error(data.detail || data.error);
        }

        localStorage.setItem('token', data.token!);

        console.log('Registro exitoso:', data);

        return data;

    } catch (error) {

        // Re-lanza el error para que sea manejado por el hook
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Error de conexión. Verifica tu internet.');
    }
};

/**
 * Verificación del token de autenticación.
 * @param token El token de autenticación del usuario.
 * @returns Una promesa que resuelve con el estado de verificación.
 */
export const verifyTokenAPI = async (token: string | null): Promise<VerifyTokenResponse> => {
    return new Promise((resolve) => {
        // Simulación de latencia de red
        setTimeout(() => {
            if (token) {
                resolve({ success: true, message: 'Token verificado correctamente.' });
            } else {
                resolve({ success: false, message: 'Token inválido o expirado.' });
            }
        }, 500);
    });
};

/**
 * Guarda o actualiza el menú en el servidor.
 * @param menuData La lista de elementos del menú a guardar.
 * @returns Una promesa que resuelve con la respuesta del servidor.
 */
export const saveMenuAPI = async (menuData: MenuItem[]): Promise<SaveMenuResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/menu/update`, {
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

/**
 * Carga la lista actual de elementos del menú desde el servidor.
 * @returns Una promesa que resuelve con la lista de MenuItem.
 */
export const loadMenuAPI = async (): Promise<MenuItem[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/menu/get`);
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


/**
 * NUEVA FUNCIÓN: Guarda o actualiza la lista completa de reservas.
 * @param reservationsData La lista completa de ReservationItem a guardar.
 * @returns Una promesa que resuelve con la respuesta del servidor.
 */
export const saveReservationsAPI = async (reservationsData: ReservationItem[]): Promise<SaveReservationsResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/reservation/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reservationsData)
        });

        const data: SaveReservationsResponse = await response.json();

        if (!response.ok) {
            const errorMessage = (data as { detail?: string; error?: string }).detail ||
                (data as { detail?: string; error?: string }).error ||
                `Error ${response.status}: Error desconocido del servidor.`;
            throw new Error(errorMessage);
        }

        console.log('Reservas guardadas exitosamente:', data);
        return data;

    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }

        throw new Error('Error de conexión. Verifica tu internet.');
    }
};

/**
 * NUEVA FUNCIÓN: Carga la lista actual de reservas desde el servidor.
 * @returns Una promesa que resuelve con la lista de ReservationItem.
 */
export const loadReservationsAPI = async (): Promise<ReservationItem[]> => {

    try {
        const response = await fetch(`${API_BASE_URL}/reservation/`); 
        const data: ReservationItem[] = await response.json();

        if (!response.ok) {
            // Manejo de errores de la API
            const errorMessage = (data as { detail?: string; error?: string }).detail ||
                (data as { detail?: string; error?: string }).error ||
                `Error ${response.status}: Error desconocido del servidor.`;
            throw new Error(errorMessage);
        }

        console.log('Reservas cargadas exitosamente:', data);
        return data;

    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }

        throw new Error('Error de conexión. Verifica tu internet.');
    }
};