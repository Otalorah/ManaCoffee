import React from 'react';
import type { AdminSidebarProps } from '../../../types/admin';

interface AdminSidebarInternalProps extends AdminSidebarProps {
    styles: { readonly [key: string]: string };
}

const AdminSidebar: React.FC<AdminSidebarInternalProps> = ({ 
    activeTab, 
    handleTabClick, 
    handleLogout, 
    toggleSidebar, 
    isSidebarOpen,
    styles 
}) => {
    return (
        <aside className={`${styles.sidebar} ${isSidebarOpen ? styles['sidebar-open'] : ''}`}>
            <div className={styles['sidebar-header-group']}>
                <h1 className={styles['sidebar-header']}>Admin Panel</h1>
                <button className={styles['hamburger-button']} onClick={toggleSidebar}>
                    {isSidebarOpen ? '✖' : '☰'}
                </button>
            </div>

            <div className={styles['sidebar-content-wrapper']}>
                <nav className={styles['sidebar-nav']}>

                    <button
                        className={`${styles['nav-item']} ${activeTab === 'MenuRegular' ? styles['nav-item-active'] : ''}`}
                        onClick={() => handleTabClick('MenuRegular')}
                    >
                        ☕ Menú
                    </button>

                    <button
                        className={`${styles['nav-item']} ${activeTab === 'ArmaTuAlmuerzo' ? styles['nav-item-active'] : ''}`}
                        onClick={() => handleTabClick('ArmaTuAlmuerzo')}
                    >
                        🍱 Arma tu almuerzo
                    </button>
                    <button
                        className={`${styles['nav-item']} ${activeTab === 'Reservas' ? styles['nav-item-active'] : ''}`}
                        onClick={() => handleTabClick('Reservas')}
                    >
                        🛎️ Reservas
                    </button>
                </nav>

                <div className={styles['sidebar-footer']}>
                    <button
                        className={styles['logout-button']}
                        onClick={handleLogout}
                    >
                        🚪 Cerrar Sesión
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default AdminSidebar;