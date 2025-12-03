import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './SignUp.module.css';

import { useSignUpForm } from '../../hooks/useSignUpForm';
import StandardInput from '../../components/ui/StandardInput';
import PasswordInput from '../../components/ui/PasswordInput';
import SubmitButton from '../../components/ui/SubmitButton';

export default function SignUp() {
    const navigate = useNavigate();
    
    const {
        formData,
        errors,
        touched,
        apiError,
        loading,
        successMessage,
        handleChange,
        handleBlur,
        handleSubmit,
    } = useSignUpForm(() => {
        console.log("Redirigiendo al login...");
        navigate('/login');
    });

    return (
        <div className={styles.container}>
            <div className={styles.card}>

                <h2 className={styles.title}>Crear cuenta administrador</h2>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Grid para Nombre y Apellido */}
                    <div className={styles.nameGrid}>
                        <StandardInput
                            label="Nombre"
                            id="nombre"
                            name="nombre"
                            placeholder="Juan"
                            value={formData.nombre}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.nombre}
                            touched={touched.nombre}
                        />
                        <StandardInput
                            label="Apellido"
                            id="apellido"
                            name="apellido"
                            placeholder="Pérez"
                            value={formData.apellido}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.apellido}
                            touched={touched.apellido}
                        />
                    </div>

                    {/* Email */}
                    <StandardInput
                        label="Correo Electrónico"
                        id="email"
                        name="email"
                        type="email"
                        placeholder="tu@ejemplo.com"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.email}
                        touched={touched.email}
                    />

                    {/* Password */}
                    <PasswordInput
                        label="Contraseña"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.password}
                        touched={touched.password}
                        isConfirm={false}
                    />

                    {/* Confirm Password */}
                    <PasswordInput
                        label="Confirmar Contraseña"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.confirmPassword}
                        touched={touched.confirmPassword}
                        isConfirm={true} // Parámetro para habilitar el mensaje de éxito "Coinciden"
                    />

                    {/* Submit Button */}
                    <SubmitButton
                        loading={loading}
                        successMessage={successMessage}
                        buttonText="Crear Cuenta"
                        loadingText="Registrando..."
                        successText="¡Creado!"
                    />
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