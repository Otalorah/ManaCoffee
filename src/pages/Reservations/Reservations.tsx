import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Users, FileText, CheckCircle, AlertCircle, User, Mail, Phone, Clock, X } from 'lucide-react';
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
    // Reservation time/type: 'time' = specific HH:mm, 'full' = restaurante completo
    const [reservationType] = useState<'time' | 'full'>('time');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [contactError, setContactError] = useState('');
    type ReservationRecord = {
        date: string;
        dateFormatted: string;
        numberOfPeople: number;
        reason: string;
        timestamp: string;
        timestampFormatted: string;
        reservationType: 'time' | 'full';
        time?: string | null;
        name?: string;
        email?: string;
        phone?: string;
    };

    const [_tempReservationData, setTempReservationData] = useState<ReservationRecord | null>(null);

    // --- Helpers to persist and read reservations locally (used for availability checks) ---
    const STORAGE_KEY = 'mc_reservations';

    const loadReservations = (): ReservationRecord[] => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return [];
            return JSON.parse(raw) as ReservationRecord[];
        } catch (err) {
            console.error('Error reading reservations from storage', err);
            return [];
        }
    };

    const saveReservationToStorage = (reservation: ReservationRecord) => {
        try {
            const list = loadReservations();
            list.push(reservation);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        } catch (err) {
            console.error('Error saving reservation to storage', err);
        }
    };

    const isAvailable = (newRes: ReservationRecord): { ok: boolean; message?: string } => {
        const existing = loadReservations();

        const newDateOnly = new Date(newRes.date).toDateString();

        const hasFullOnDate = existing.some((r) => r.reservationType === 'full' && new Date(r.date).toDateString() === newDateOnly);
        if (hasFullOnDate) return { ok: false, message: 'Sin cupo. Comunícate al WhatsApp.' };

        if (newRes.reservationType === 'full') {
            const anyOnDate = existing.some((r) => new Date(r.date).toDateString() === newDateOnly);
            if (anyOnDate) return { ok: false, message: 'Sin cupo. Comunícate al WhatsApp.' };
            return { ok: true };
        }

        // (no 'allday' option: only 'time' or 'full')

        // specific time
        const time = newRes.time || '';
        const totalForTime = existing.reduce((sum: number, r) => {
            if (new Date(r.date).toDateString() !== newDateOnly) return sum;
            if (r.reservationType === 'full') return sum + 35;
            if (r.time === time) return sum + (Number(r.numberOfPeople) || 0);
            return sum;
        }, 0);

        if (totalForTime + Number(newRes.numberOfPeople) > 35) return { ok: false, message: 'Sin cupo. Comunícate al WhatsApp.' };
        return { ok: true };
    };

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
        setContactError('');

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

        if (reservationType === 'time') {
            if (!time.trim()) {
                setError('Por favor selecciona una hora para tu reservación');
                return;
            }
        }

        // Guardar datos temporales y mostrar modal
        const reservationData: ReservationRecord = {
            date: selectedDate.toISOString(),
            dateFormatted: selectedDate.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            numberOfPeople: peopleCount,
            reason: reason.trim(),
            timestamp: new Date().toISOString(),
            timestampFormatted: new Date().toLocaleString('es-ES'),
            reservationType: reservationType,
            time: reservationType === 'time' ? time || null : null
        };

        setTempReservationData(reservationData);
        setShowContactModal(true);
    };

    const handleContactSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setContactError('');

        // Validar nombre
        if (!name.trim()) {
            setContactError('Por favor ingresa tu nombre');
            return;
        }

        // Validar email
        if (!email.trim()) {
            setContactError('Por favor ingresa tu correo electrónico');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setContactError('Por favor ingresa un correo electrónico válido');
            return;
        }

        // Validar teléfono
        if (!phone.trim()) {
            setContactError('Por favor ingresa tu número celular');
            return;
        }

        setLoading(true);

        try {
            if (!selectedDate) {
                setContactError('Por favor selecciona una fecha');
                setLoading(false);
                return;
            }

            // Calculate people count
            const peopleCount = parseInt(numberOfPeople);
            if (isNaN(peopleCount) || peopleCount < 1 || peopleCount > 35) {
                setContactError('El número de personas debe estar entre 1 y 35');
                setLoading(false);
                return;
            }

            // Create reservation data
            const reservationData: ReservationRecord = {
                date: selectedDate.toISOString(),
                dateFormatted: selectedDate.toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                time: reservationType === 'time' ? time || null : null,
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                numberOfPeople: peopleCount,
                reason: reason.trim(),
                timestamp: new Date().toISOString(),
                timestampFormatted: new Date().toLocaleString('es-ES'),
                reservationType: reservationType
            };

            // Check availability against stored reservations
            const availability = isAvailable(reservationData);
            if (!availability.ok) {
                setContactError(availability.message || 'Sin cupo. Comunícate al WhatsApp.');
                setLoading(false);
                return;
            }

            // Create filename with timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `reservation_${timestamp}.json`;

            console.log('Reservación completa:', reservationData);
            console.log('Sería guardada en:', `public/data/reservations/${filename}`);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            // Persist to localStorage (so availability checks work)
            try {
                saveReservationToStorage(reservationData);
            } catch (err) {
                console.warn('No se pudo guardar localmente', err);
            }

            // Show success message
            setSuccess(true);

            // Reset all form
            setSelectedDate(undefined);
            setTime('');
            setName('');
            setEmail('');
            setPhone('');
            setNumberOfPeople('');
            setReason('');
            setName('');
            setEmail('');
            setPhone('');
            setShowContactModal(false);
            setTempReservationData(null);

            // Scroll to top to show success message
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (err) {
            console.error('Error saving reservation:', err);
            setContactError('Error al guardar la reservación. Por favor intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        if (!loading) {
            setShowContactModal(false);
            setName('');
            setEmail('');
            setPhone('');
            setContactError('');
            setTempReservationData(null);
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
                                        Confirmar
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Modal para datos de contacto */}
            {showContactModal && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>Información de Contacto</h2>
                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={loading}
                                className={styles.closeButton}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {contactError && (
                            <div className={styles.errorAlert}>
                                <AlertCircle className={styles.alertIcon} />
                                <p>{contactError}</p>
                            </div>
                        )}

                        <form onSubmit={handleContactSubmit} className={styles.contactForm}>
                            <div className={styles.fieldContainer}>
                                <label htmlFor="name" className={styles.label}>
                                    <Users size={18} className={styles.labelIcon} />
                                    Nombre Completo *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={styles.input}
                                    placeholder="Tu nombre"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className={styles.fieldContainer}>
                                <label htmlFor="email" className={styles.label}>
                                    <FileText size={18} className={styles.labelIcon} />
                                    Correo Electrónico *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={styles.input}
                                    placeholder="tu@correo.com"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className={styles.fieldContainer}>
                                <label htmlFor="phone" className={styles.label}>
                                    <Users size={18} className={styles.labelIcon} />
                                    Número Celular *
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className={styles.input}
                                    placeholder="+57 123 456 7890"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className={styles.modalActions}>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={loading}
                                    className={styles.cancelButton}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
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
                                            Realizar Reserva
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
