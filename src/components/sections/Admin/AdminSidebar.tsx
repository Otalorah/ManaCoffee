import React from 'react';
import type { AdminSidebarProps, ActiveTab } from '../../../types/admin'; // Asegúrate de que ActiveTab ahora solo tiene 'ArmaTuAlmuerzo' y 'Reservas'

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
    
    const navItems: { tab: ActiveTab; label: string; icon: string }[] = [
        { tab: 'ArmaTuAlmuerzo', label: 'Arma tu Almuerzo', icon: '🍱' },
        { tab: 'Reservas', label: 'Reservas', icon: '🗓️' },
    ];
    
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

                    {navItems.map((item) => (
                        <button
                            key={item.tab}
                            className={`${styles['nav-item']} ${activeTab === item.tab ? styles['nav-item-active'] : ''}`}
                            onClick={() => handleTabClick(item.tab)}
                        >
                            {item.icon} {item.label}
                        </button>
                    ))}

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