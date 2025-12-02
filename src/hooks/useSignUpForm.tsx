import { useState } from 'react';
import { registerUser } from '../lib/API';
import { validateField } from '../lib/sign/signUpValidation';
import type { ChangeEvent, FocusEvent, FormEvent } from 'react';
import type { FormData, FormErrors, TouchedState } from '../types/api.ts';

export const useSignUpForm = (onSuccess?: () => void) => {
    const [formData, setFormData] = useState<FormData>({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<TouchedState>({});
    const [apiError, setApiError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const fieldName = name as keyof FormData;

        setFormData(prev => ({ ...prev, [fieldName]: value }));
        if (touched[fieldName]) {
            const newErrors = validateField(fieldName, value, formData, errors, touched);
            setErrors(newErrors);
        }
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const fieldName = name as keyof FormData;

        setTouched(prev => ({ ...prev, [fieldName]: true }));
        const newErrors = validateField(fieldName, value, formData, errors, touched);
        setErrors(newErrors);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const allTouched: TouchedState = { 
            nombre: true, 
            apellido: true, 
            email: true, 
            password: true, 
            confirmPassword: true 
        };
        setTouched(allTouched);

        const hasErrors = Object.keys(errors).length > 0 || !formData.email || !formData.password;

        if (!hasErrors) {
            setLoading(true);
            setApiError('');
            setSuccessMessage('');

            try {
                await registerUser({
                    name: formData.nombre,
                    lastname: formData.apellido,
                    email: formData.email,
                    password: formData.password
                });

                setSuccessMessage('¡Cuenta creada con éxito! Redirigiendo...');
                setFormData({ nombre: '', apellido: '', email: '', password: '', confirmPassword: '' });
                setTouched({});

                setTimeout(() => {
                    if (onSuccess) onSuccess();
                }, 2000);

            } catch (error: unknown) {
                let errorMessage = 'Ocurrió un error inesperado. Intenta nuevamente.';

                if (error instanceof Error) {
                    errorMessage = error.message;
                } else if (typeof error === 'string') {
                    errorMessage = error;
                }

                setApiError(errorMessage);
            } finally {
                setLoading(false);
            }
        }
    };

    return {
        formData,
        errors,
        touched,
        apiError,
        loading,
        successMessage,
        handleChange,
        handleBlur,
        handleSubmit,
    };
};