import { useState } from 'react';
import type { ChangeEvent, FocusEvent, FormEvent } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './SignUp.module.css';

// --- Interfaces y Tipos ---

interface FormData {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    confirmPassword: string;
}

// Mapea las llaves de FormData a strings (mensajes de error)
type FormErrors = Partial<Record<keyof FormData, string>>;

// Mapea las llaves de FormData a booleanos
type TouchedState = Partial<Record<keyof FormData, boolean>>;

export default function SignUp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<TouchedState>({});
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [apiError, setApiError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Forzamos el tipado del name para que coincida con las claves de FormData
        const fieldName = name as keyof FormData;

        setFormData(prev => ({ ...prev, [fieldName]: value }));
        if (touched[fieldName]) validateField(fieldName, value);
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const fieldName = name as keyof FormData;

        setTouched(prev => ({ ...prev, [fieldName]: true }));
        validateField(fieldName, value);
    };

    const validateField = (name: keyof FormData, value: string) => {
        const newErrors: FormErrors = { ...errors };

        switch (name) {
            case 'nombre':
                if (!value.trim()) newErrors.nombre = 'El nombre es requerido';
                else if (value.trim().length < 2) newErrors.nombre = 'Mínimo 2 caracteres';
                else delete newErrors.nombre;
                break;
            case 'apellido':
                if (!value.trim()) newErrors.apellido = 'El apellido es requerido';
                else if (value.trim().length < 2) newErrors.apellido = 'Mínimo 2 caracteres';
                else delete newErrors.apellido;
                break;
            case 'email':
                {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!value) newErrors.email = 'El correo es requerido';
                    else if (!emailRegex.test(value)) newErrors.email = 'Ingresa un correo válido';
                    else delete newErrors.email;
                    break;
                }
            case 'password':
                if (!value) newErrors.password = 'La contraseña es requerida';
                else if (value.length < 8) newErrors.password = 'Mínimo 8 caracteres';
                else if (!/(?=.*[a-z])/.test(value)) newErrors.password = 'Al menos una minúscula';
                else if (!/(?=.*[A-Z])/.test(value)) newErrors.password = 'Al menos una mayúscula';
                else if (!/(?=.*\d)/.test(value)) newErrors.password = 'Al menos un número';
                else delete newErrors.password;

                // Validar confirmación si ya fue tocada
                if (touched.confirmPassword && formData.confirmPassword) {
                    if (value !== formData.confirmPassword) newErrors.confirmPassword = 'No coinciden';
                    else delete newErrors.confirmPassword;
                }
                break;
            case 'confirmPassword':
                if (!value) newErrors.confirmPassword = 'Confirma tu contraseña';
                else if (value !== formData.password) newErrors.confirmPassword = 'No coinciden';
                else delete newErrors.confirmPassword;
                break;
            default: break;
        }
        setErrors(newErrors);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const allTouched: TouchedState = { nombre: true, apellido: true, email: true, password: true, confirmPassword: true };
        setTouched(allTouched);

        // Validación simple antes de enviar
        const hasErrors = Object.keys(errors).length > 0 || !formData.email || !formData.password;

        if (!hasErrors) {
            setLoading(true);
            setApiError('');
            setSuccessMessage('');

            const userData = {
                name: formData.nombre,
                lastname: formData.apellido,
                email: formData.email,
                password: formData.password
            };

            try {
                const response = await fetch('https://apimanacoffee-production.up.railway.app/user/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.detail || data.error || 'Error en el registro');
                }

                console.log('Registro exitoso:', data);
                setSuccessMessage('¡Cuenta creada con éxito! Redirigiendo...');
                setFormData({ nombre: '', apellido: '', email: '', password: '', confirmPassword: '' });
                setTouched({});

                // Simulación de redirección
                setTimeout(() => {
                    // window.location.href = '/login';
                    console.log("Redirigiendo al login...");
                }, 2000);

            } catch (error: unknown) {
                console.error('Error al registrar:', error);

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

    return (
        <div className={styles.container}>

            <div className={styles.card}>
                <button
                    onClick={() => navigate('/')}
                    className={styles.backButton}
                    type="button"
                    aria-label="Volver a la página principal"
                >
                    <ArrowLeft size={24} />
                </button>

                <h2 className={styles.title}>
                    Crear Cuenta
                </h2>

                <form onSubmit={handleSubmit} className={styles.form}>

                    {/* Grid para Nombre y Apellido */}
                    <div className={styles.nameGrid}>
                        <div className={styles.fieldContainer}>
                            <label htmlFor="nombre" className={styles.label}>Nombre</label>
                            <input
                                type="text" id="nombre" name="nombre" placeholder="Juan"
                                value={formData.nombre} onChange={handleChange} onBlur={handleBlur}
                                className={errors.nombre && touched.nombre ? styles.inputError : styles.input}
                            />
                            {errors.nombre && touched.nombre && <span className={styles.errorText}><AlertCircle size={12} />{errors.nombre}</span>}
                        </div>

                        <div className={styles.fieldContainer}>
                            <label htmlFor="apellido" className={styles.label}>Apellido</label>
                            <input
                                type="text" id="apellido" name="apellido" placeholder="Pérez"
                                value={formData.apellido} onChange={handleChange} onBlur={handleBlur}
                                className={errors.apellido && touched.apellido ? styles.inputError : styles.input}
                            />
                            {errors.apellido && touched.apellido && <span className={styles.errorText}><AlertCircle size={12} />{errors.apellido}</span>}
                        </div>
                    </div>

                    {/* Email */}
                    <div className={styles.fieldContainer}>
                        <label htmlFor="email" className={styles.label}>Correo Electrónico</label>
                        <input
                            type="email" id="email" name="email" placeholder="tu@ejemplo.com"
                            value={formData.email} onChange={handleChange} onBlur={handleBlur}
                            className={errors.email && touched.email ? styles.inputError : styles.input}
                        />
                        {errors.email && touched.email && <span className={styles.errorText}><AlertCircle size={12} />{errors.email}</span>}
                    </div>

                    {/* Passwords */}
                    <div className={styles.fieldContainer}>
                        <label htmlFor="password" className={styles.label}>Contraseña</label>
                        <div className={styles.passwordContainer}>
                            <input
                                type={showPassword ? "text" : "password"} id="password" name="password" placeholder="••••••••"
                                value={formData.password} onChange={handleChange} onBlur={handleBlur}
                                className={errors.password && touched.password ? styles.passwordInputError : styles.passwordInput}
                            />
                            <button
                                type="button" onClick={() => setShowPassword(!showPassword)}
                                className={styles.toggleButton}
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.password && touched.password && <span className={styles.errorText}><AlertCircle size={12} />{errors.password}</span>}
                    </div>

                    <div className={styles.fieldContainer}>
                        <label htmlFor="confirmPassword" className={styles.label}>Confirmar Contraseña</label>
                        <div className={styles.passwordContainer}>
                            <input
                                type={showConfirmPassword ? "text" : "password"} id="confirmPassword" name="confirmPassword" placeholder="••••••••"
                                value={formData.confirmPassword} onChange={handleChange} onBlur={handleBlur}
                                className={errors.confirmPassword && touched.confirmPassword ? styles.passwordInputError : styles.passwordInput}
                            />
                            <button
                                type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className={styles.toggleButton}
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.confirmPassword && touched.confirmPassword && <span className={styles.errorText}><AlertCircle size={12} />{errors.confirmPassword}</span>}
                        {!errors.confirmPassword && touched.confirmPassword && formData.confirmPassword && formData.password && (
                            <span className={styles.successText}><CheckCircle2 size={12} /> Coinciden</span>
                        )}
                    </div>

                    {/* Botón de Submit */}
                    <button
                        type="submit"
                        disabled={loading || !!successMessage}
                        className={successMessage ? styles.submitButtonSuccess : styles.submitButton}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin h-5 w-5" />
                                Registrando...
                            </>
                        ) : successMessage ? (
                            <>
                                <CheckCircle2 className="h-5 w-5" />
                                ¡Creado!
                            </>
                        ) : (
                            'Crear Cuenta'
                        )}
                    </button>
                </form>


                {/* Feedback Messages */}
                {apiError && (
                    <div className={styles.errorAlert}>
                        <AlertCircle className={styles.alertIcon} />
                        <p>{apiError}</p>
                    </div>
                )}

                {successMessage && (
                    <div className={styles.successAlert}>
                        <CheckCircle2 className={styles.alertIcon} />
                        <p>{successMessage}</p>
                    </div>
                )}

                <div className={styles.footer}>
                    <p className={styles.footerText}>
                        ¿Ya tienes cuenta?{' '}
                        <a href="/login" className={styles.link}>
                            Inicia sesión aquí
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}