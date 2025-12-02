/**
 * Interface para los datos de registro de usuario
 */
export interface UserRegistrationData {
    name: string;
    lastname: string;
    email: string;
    password: string;
}

/**
 * Interface para la respuesta de la API
 */
export interface ApiResponse {
    detail?: string;
    error?: string;
    token?: string;
    [key: string]: unknown;
}

export interface FormData {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    confirmPassword: string;
}

// Mapea las llaves de FormData a strings (mensajes de error)
export type FormErrors = Partial<Record<keyof FormData, string>>;

// Mapea las llaves de FormData a booleanos
export type TouchedState = Partial<Record<keyof FormData, boolean>>;

/**
 * Interface para enviar email
 */
export interface EmailData {
    email: string;
}

/**
 * Interface para enviar código de verificación
 */
export interface CodeData {
    email: string;
    code: string;
}

/**
 * Interface para actualizar contraseña
 */
export interface PasswordUpdateData {
    password: string;
}