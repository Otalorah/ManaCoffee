import type { FormData, FormErrors, TouchedState } from '../../types/api.ts';

/**
 * Valida un campo individual del formulario
 * @param name - Nombre del campo a validar
 * @param value - Valor actual del campo
 * @param formData - Datos completos del formulario
 * @param errors - Errores actuales
 * @param touched - Campos que han sido tocados
 * @returns Objeto con los errores actualizados
 */
export const validateField = (
    name: keyof FormData,
    value: string,
    formData: FormData,
    errors: FormErrors,
    touched: TouchedState
): FormErrors => {
    const newErrors: FormErrors = { ...errors };

    switch (name) {
        case 'nombre':
            if (!value.trim()) {
                newErrors.nombre = 'El nombre es requerido';
            } else if (value.trim().length < 2) {
                newErrors.nombre = 'Mínimo 2 caracteres';
            } else {
                delete newErrors.nombre;
            }
            break;

        case 'apellido':
            if (!value.trim()) {
                newErrors.apellido = 'El apellido es requerido';
            } else if (value.trim().length < 2) {
                newErrors.apellido = 'Mínimo 2 caracteres';
            } else {
                delete newErrors.apellido;
            }
            break;

        case 'email':
            {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    newErrors.email = 'El correo es requerido';
                } else if (!emailRegex.test(value)) {
                    newErrors.email = 'Ingresa un correo válido';
                } else {
                    delete newErrors.email;
                }
                break;
            }

        case 'password':
            if (!value) {
                newErrors.password = 'La contraseña es requerida';
            } else if (value.length < 8) {
                newErrors.password = 'Mínimo 8 caracteres';
            } else if (!/(?=.*[a-z])/.test(value)) {
                newErrors.password = 'Al menos una minúscula';
            } else if (!/(?=.*[A-Z])/.test(value)) {
                newErrors.password = 'Al menos una mayúscula';
            } else if (!/(?=.*\d)/.test(value)) {
                newErrors.password = 'Al menos un número';
            } else {
                delete newErrors.password;
            }

            // Validar confirmación si ya fue tocada
            if (touched.confirmPassword && formData.confirmPassword) {
                if (value !== formData.confirmPassword) {
                    newErrors.confirmPassword = 'No coinciden';
                } else {
                    delete newErrors.confirmPassword;
                }
            }
            break;

        case 'confirmPassword':
            if (!value) {
                newErrors.confirmPassword = 'Confirma tu contraseña';
            } else if (value !== formData.password) {
                newErrors.confirmPassword = 'No coinciden';
            } else {
                delete newErrors.confirmPassword;
            }
            break;

        default:
            break;
    }

    return newErrors;
};

/**
 * Valida todos los campos del formulario de una vez
 * @param formData - Datos completos del formulario
 * @returns Objeto con todos los errores encontrados
 */
export const validateForm = (formData: FormData): FormErrors => {
    const errors: FormErrors = {};

    if (!formData.nombre.trim()) {
        errors.nombre = 'El nombre es requerido';
    }

    if (!formData.apellido.trim()) {
        errors.apellido = 'El apellido es requerido';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
        errors.email = 'El correo es requerido';
    } else if (!emailRegex.test(formData.email)) {
        errors.email = 'Ingresa un correo válido';
    }

    if (!formData.password) {
        errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
        errors.password = 'Mínimo 8 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    return errors;
};