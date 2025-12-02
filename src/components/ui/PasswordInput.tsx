import { useState } from 'react';
import type {ChangeEvent, FocusEvent} from 'react';
import styles from '../../pages/signUp/SignUp.module.css';
import { Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

interface PasswordInputProps {
    label: string;
    id: string;
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
    error?: string;
    touched?: boolean;
    isConfirm: boolean;
}

const PasswordInput = ({
    label,
    id,
    name,
    value,
    onChange,
    onBlur,
    error,
    touched,
    isConfirm
}: PasswordInputProps) => {

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const toggleVisibility = () => setShowPassword(!showPassword);

    const isError = error && touched;
    const isSuccess = isConfirm && !isError && touched && value;

    return (
        <div className={styles.fieldContainer}>
            <label htmlFor={id} className={styles.label}>{label}</label>
            <div className={styles.passwordContainer}>
                <input
                    type={showPassword ? "text" : "password"}
                    id={id}
                    name={name}
                    placeholder="••••••••"
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    className={isError ? styles.passwordInputError : styles.passwordInput}
                />
                <button
                    type="button"
                    onClick={toggleVisibility}
                    className={styles.toggleButton}
                    tabIndex={-1}
                    aria-label={showPassword ? "Ocultar Contraseña" : "Mostrar Contraseña"}
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
            {isError && (
                <span className={styles.errorText}>
                    <AlertCircle size={12} className="flex-shrink-0" />
                    {error}
                </span>
            )}
            {isSuccess && (
                <span className={styles.successText}>
                    <CheckCircle2 size={12} className="flex-shrink-0" /> Coinciden
                </span>
            )}
        </div>
    );
};

export default PasswordInput;