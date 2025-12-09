import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Users, FileText, CheckCircle, AlertCircle, User, Mail, Phone, Clock } from 'lucide-react';
import Header from '../../components/layout/Header/Header';
import styles from './Reservations.module.css';

export default function Reservations() {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [time, setTime] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [numberOfPeople, setNumberOfPeople] = useState('');
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Generate time options every 30 minutes from 7:30 AM to 9:00 PM
    const generateTimeOptions = () => {
        const options: { value: string; label: string }[] = [];
        const startMinutes = 7 * 60 + 30; // 7:30 AM in minutes
        const endMinutes = 20.5 * 60; // 9:00 PM (21:00) in minutes
        
        for (let minutes = startMinutes; minutes <= endMinutes; minutes += 30) {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            const time24h = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
            const date = new Date(`2000-01-01T${time24h}`);
            const time12h = date.toLocaleTimeString('es-ES', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
            
            options.push({
                value: time24h,
                label: time12h
            });
        }
        
        return options;
    };

    const timeOptions = generateTimeOptions();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        // Validation
        if (!selectedDate) {
            setError('Por favor selecciona una fecha para tu reservación');
            return;
        }

        if (!time.trim()) {
            setError('Por favor selecciona una hora para tu reservación');
            return;
        }

        if (!name.trim()) {
            setError('Por favor ingresa tu nombre completo');
            return;
        }

        if (!email.trim()) {
            setError('Por favor ingresa tu correo electrónico');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            setError('Por favor ingresa un correo electrónico válido');
            return;
        }

        if (!phone.trim()) {
            setError('Por favor ingresa tu número de teléfono');
            return;
        }

        const peopleCount = parseInt(numberOfPeople);
        if (isNaN(peopleCount) || peopleCount < 1 || peopleCount > 35) {
            setError('El número de personas debe estar entre 1 y 35');
            return;
        }

        if (!reason.trim()) {
            setError('Por favor indica la razón de tu reservación');
            return;
        }

        setLoading(true);

        try {
            // Format time for display
            const [hours, minutes] = time.split(':');
            const timeFormatted = `${hours}:${minutes}`;
            const timeFormatted12h = new Date(`2000-01-01T${time}`).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });

            // Create reservation data
            const reservationData = {
                date: selectedDate.toISOString(),
                dateFormatted: selectedDate.toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                time: timeFormatted,
                timeFormatted: timeFormatted12h,
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                numberOfPeople: peopleCount,
                reason: reason.trim(),
                timestamp: new Date().toISOString(),
                timestampFormatted: new Date().toLocaleString('es-ES')
            };

            // Create filename with timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `reservation_${timestamp}.json`;

            // In a real application, this would be sent to a backend API
            // For now, we'll log it and show success
            console.log('Reservation data:', reservationData);
            console.log('Would save to:', `public/data/reservations/${filename}`);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            // Show success message
            setSuccess(true);

            // Reset form
            setSelectedDate(undefined);
            setTime('');
            setName('');
            setEmail('');
            setPhone('');
            setNumberOfPeople('');
            setReason('');

            // Scroll to top to show success message
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (err) {
            console.error('Error saving reservation:', err);
            setError('Error al guardar la reservación. Por favor intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.content}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Reservaciones</h1>
                    <p className={styles.subtitle}>
                        Reserva tu espacio en Mana Coffee. Selecciona una fecha y completa el formulario.
                    </p>
                </div>

                {success && (
                    <div className={styles.successAlert}>
                        <CheckCircle className={styles.alertIcon} />
                        <div>
                            <p className={styles.alertTitle}>¡Reservación exitosa!</p>
                            <p className={styles.alertText}>
                                Tu reservación ha sido guardada. Nos pondremos en contacto contigo pronto.
                            </p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className={styles.errorAlert}>
                        <AlertCircle className={styles.alertIcon} />
                        <p>{error}</p>
                    </div>
                )}

                <div className={styles.mainContent}>
                    <div className={styles.calendarSection}>
                        <div className={styles.sectionHeader}>
                            <CalendarIcon className={styles.sectionIcon} />
                            <h2 className={styles.sectionTitle}>Selecciona una Fecha</h2>
                        </div>
                        <div className={styles.calendarContainer}>
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                className={styles.calendar}
                            />
                        </div>
                        {selectedDate && (
                            <div className={styles.selectedDateDisplay}>
                                <p className={styles.selectedDateLabel}>Fecha seleccionada:</p>
                                <p className={styles.selectedDateValue}>
                                    {selectedDate.toLocaleDateString('es-ES', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className={styles.formSection}>
                        <div className={styles.sectionHeader}>
                            <FileText className={styles.sectionIcon} />
                            <h2 className={styles.sectionTitle}>Detalles de la Reservación</h2>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.fieldContainer}>
                                <label htmlFor="time" className={styles.label}>
                                    <Clock size={18} className={styles.labelIcon} />
                                    Hora de la Reservación
                                </label>
                                <select
                                    id="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className={styles.input}
                                    required
                                >
                                    <option value="">Selecciona una hora</option>
                                    {timeOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <p className={styles.fieldHint}>Horario disponible: 7:30 am - 9:00 pm (cada 30 minutos)</p>
                            </div>

                            <div className={styles.fieldContainer}>
                                <label htmlFor="name" className={styles.label}>
                                    <User size={18} className={styles.labelIcon} />
                                    Nombre Completo
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={styles.input}
                                    placeholder="Ej: Juan Pérez"
                                    required
                                />
                            </div>

                            <div className={styles.fieldContainer}>
                                <label htmlFor="email" className={styles.label}>
                                    <Mail size={18} className={styles.labelIcon} />
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={styles.input}
                                    placeholder="Ej: juan.perez@ejemplo.com"
                                    required
                                />
                            </div>

                            <div className={styles.fieldContainer}>
                                <label htmlFor="phone" className={styles.label}>
                                    <Phone size={18} className={styles.labelIcon} />
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className={styles.input}
                                    placeholder="Ej: +34 123 456 789"
                                    required
                                />
                            </div>

                            <div className={styles.fieldContainer}>
                                <label htmlFor="numberOfPeople" className={styles.label}>
                                    <Users size={18} className={styles.labelIcon} />
                                    Número de Personas
                                </label>
                                <input
                                    type="number"
                                    id="numberOfPeople"
                                    value={numberOfPeople}
                                    onChange={(e) => setNumberOfPeople(e.target.value)}
                                    className={styles.input}
                                    placeholder="Ej: 10"
                                    min="1"
                                    max="35"
                                    required
                                />
                                <p className={styles.fieldHint}>Máximo 35 personas</p>
                            </div>

                            <div className={styles.fieldContainer}>
                                <label htmlFor="reason" className={styles.label}>
                                    <FileText size={18} className={styles.labelIcon} />
                                    Razón de la Reservación
                                </label>
                                <textarea
                                    id="reason"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className={styles.textarea}
                                    placeholder="Ej: Reunión de equipo, celebración de cumpleaños, evento corporativo..."
                                    rows={5}
                                    required
                                />
                                <p className={styles.fieldHint}>
                                    Cuéntanos sobre tu evento para preparar el mejor servicio
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !selectedDate || !time}
                                className={styles.submitButton}
                            >
                                {loading ? (
                                    <>
                                        <div className={styles.spinner} />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={20} />
                                        Confirmar Reservación
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
