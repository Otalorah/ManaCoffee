import React from 'react';
import type { BuildYourLunchContentProps } from '../../../types/admin';

const BuildYourLunchContent: React.FC<BuildYourLunchContentProps> = ({
    menuList,
    newIngredient,
    apiMessage,
    isSaving,
    handleInputChange,
    handleAddIngredient,
    handleDeleteIngredient,
    handleSaveMenu,
    styles
}) => {
    return (
        <div className={styles['content-panel']}>
            <h2 className={styles.subheader}>Administración de Arma tu almuerzo 🍱</h2>

            {/* Mensaje de la API*/}
            {apiMessage && (
                <div className={styles.message} style={{
                    backgroundColor: apiMessage.type === 'success' ? '#d9ead3' : (apiMessage.type === 'warning' ? '#fff2cc' : (apiMessage.type === 'error' ? '#f4cccc' : '#e6f7ff')),
                    color: apiMessage.type === 'success' ? '#38761d' : (apiMessage.type === 'warning' ? '#cc9900' : (apiMessage.type === 'error' ? '#cc0000' : '#00529b')),
                    fontWeight: 'bold'
                }}>
                    {apiMessage.text}
                </div>
            )}

            <h3 className={styles['form-title']}>Lista de Ingredientes</h3>

            {/* Tabla de Ingredientes*/}
            {menuList.length > 0 ? (
                <div className={styles['table-container']}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>Nombre</th>
                                <th className={styles.th}>Precio ($)</th>
                                <th className={`${styles.th} ${styles.width}`}>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {menuList.map((item, index) => (
                                <tr key={index}>
                                    <td className={styles.td}>{item.name}</td>
                                    <td className={styles.td}>{item.price}</td>
                                    <td className={`${styles.td} ${styles.width}`}>
                                        <button
                                            className={styles['delete-button']}
                                            onClick={() => handleDeleteIngredient(index)}
                                        >
                                            ❌ Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className={styles.placeholder}>No hay elementos en el menú. ¡Agrega el primero!</p>
            )}

            <h3 className={styles['form-title']}>Agregar Nuevo Ingrediente</h3>

            {/* Formulario */}
            <form onSubmit={handleAddIngredient} className={styles.form}>
                <div className={styles['input-group']}>
                    <label htmlFor="name" className={styles.label}>Nombre:</label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={newIngredient.name}
                        onChange={handleInputChange}
                        className={styles.input}
                        placeholder="Ej: Leche, Azúcar, etc."
                        required
                    />
                </div>

                <div className={styles['input-group']}>
                    <label htmlFor="price" className={styles.label}>Precio (por unidad):</label>
                    <input
                        id="price"
                        type="number"
                        name="price"
                        value={newIngredient.price || ''}
                        onChange={handleInputChange}
                        className={styles.input}
                        placeholder="Ej: 5"
                        min="0"
                        step="1"
                        required
                    />
                </div>

                <button type="submit" className={styles['add-button']}>
                    Agregar
                </button>
            </form>


            {/* Botón Guardar Menu */}
            <div className={styles['save-button-container']}>
                <button
                    onClick={handleSaveMenu}
                    className={styles['save-button']}
                    disabled={isSaving || menuList.length === 0}
                >
                    {isSaving ? 'Guardando...' : 'Guardar Menú'}
                </button>
            </div>
        </div>
    );
};

export default BuildYourLunchContent;