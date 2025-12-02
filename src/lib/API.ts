import type { UserRegistrationData, ApiResponse, EmailData, CodeData, PasswordUpdateData } from '../types/api';
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