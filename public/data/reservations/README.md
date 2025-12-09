# Reservations Directory

This directory stores reservation data as JSON files.

Each reservation file is named with a timestamp: `reservation_YYYY-MM-DDTHH-MM-SS.json`

## File Structure

Each reservation file contains:
- `date`: ISO string of the selected reservation date
- `dateFormatted`: Human-readable date in Spanish
- `time`: Time of the reservation in 24-hour format (HH:MM)
- `timeFormatted`: Human-readable time in 12-hour format with AM/PM
- `name`: Full name of the person making the reservation
- `email`: Email address of the person making the reservation
- `phone`: Phone number of the person making the reservation
- `numberOfPeople`: Number of people for the reservation (1-35)
- `reason`: Reason for the reservation
- `timestamp`: ISO string of when the reservation was created
- `timestampFormatted`: Human-readable timestamp in Spanish

## Example

```json
{
  "date": "2025-12-15T00:00:00.000Z",
  "dateFormatted": "viernes, 15 de diciembre de 2025",
  "time": "14:30",
  "timeFormatted": "02:30 p. m.",
  "name": "Juan Pérez",
  "email": "juan.perez@ejemplo.com",
  "phone": "+34 123 456 789",
  "numberOfPeople": 20,
  "reason": "Reunión de equipo de fin de año",
  "timestamp": "2025-11-30T22:48:00.000Z",
  "timestampFormatted": "30/11/2025, 17:48:00"
}
```
