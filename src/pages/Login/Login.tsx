import { useState } from 'react';
import type { FormEvent } from 'react';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Login.module.css';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const loginData = {
            email: email,
            password: password
        };

        try {
            const response = await fetch('https://apimanacoffee-production.up.railway.app/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData)
            });

            const data = await response.json();

            if (!response.ok) {
                // Mostrar el mensaje de error de la API
                setError(data.detail || 'Error en el inicio de sesión');
                return;
            }

            console.log('Login exitoso:', data);

            // Usar el contexto para iniciar sesión y guardar cookie
            const tokenToSave = data.token || data.access_token || JSON.stringify(data);
            login(tokenToSave);

            // Redirigir a la landing page o admin si viene en la respuesta
            const redirectPath = data.redirect || '/';
            navigate(redirectPath);

        } catch (error: unknown) { // Usamos 'unknown' para seguridad de tipos
            console.error('Error al iniciar sesión:', error);

            let errorMessage = 'Error de conexión. Por favor, intenta de nuevo.';
            if (error instanceof Error) {
                errorMessage = error.message;
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>

                <h2 className={styles.title}>
                    Iniciar Sesión
                </h2>

                <form onSubmit={handleSubmit} className={styles.form}>

                    {error && (
                        <div className={styles.errorAlert}>
                            <AlertCircle className={styles.errorIcon} />
                            <p>{error}</p>
                        </div>
                    )}

                    <div className={styles.fieldContainer}>
                        <label htmlFor="email" className={styles.label}>
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                            placeholder="tu@correo.com"
                            required
                        />
                    </div>

                    <div className={styles.fieldContainer}>
                        <label htmlFor="password" className={styles.label}>
                            Contraseña
                        </label>
                        <div className={styles.passwordContainer}>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles.passwordInput}
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={styles.toggleButton}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className={styles.forgotPasswordContainer}>
                        <a href="/password" className={styles.link}>
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={styles.submitButton}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin h-5 w-5" />
                                Cargando...
                            </>
                        ) : (
                            'Ingresar'
                        )}
                    </button>
                </form>

                <div className={styles.footer}>
                    <p className={styles.footerText}>
                        ¿No tienes cuenta?{' '}
                        <a href="/signup" className={styles.link}>
                            Créala aquí
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}