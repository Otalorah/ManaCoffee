import { AlertCircle } from 'lucide-react';
import styles from '../../pages/signUp/SignUp.module.css';
import type { ChangeEvent, FocusEvent, KeyboardEvent } from 'react';

interface UnifiedInputProps {
    label: string;
    id: string;
    name?: string;
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
    onKeyPress?: (e: KeyboardEvent<HTMLInputElement>) => void;
    error?: string;
    touched?: boolean;
    disabled?: boolean;
    maxLength?: number;
    className?: string;
}

const UnifiedInput = ({
    label,
    id,
    name,
    type = 'text',
    placeholder = '',
    value,
    onChange,
    onBlur,
    onKeyPress,
    error,
    touched,
    disabled = false,
    maxLength,
    className = ''
}: UnifiedInputProps) => {
    const isError = error && touched;
    const inputClassName = isError ? styles.inputError : styles.input;

    return (
        <div className={styles.fieldContainer}>
            <label htmlFor={id} className={styles.label}>
                {label}
            </label>
            <input
                type={type}
                id={id}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                onKeyPress={onKeyPress}
                disabled={disabled}
                maxLength={maxLength}
                className={`${inputClassName} ${className}`}
            />
            {isError && (
                <span className={styles.errorText}>
                    <AlertCircle size={12} className="flex-shrink-0" />
                    {error}
                </span>
            )}
        </div>
    );
};

export default UnifiedInput;