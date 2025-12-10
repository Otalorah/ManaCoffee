export interface VerifyTokenResponse {
    success: boolean;
    message: string;
}

export interface MenuItem {
    name: string;
    price: number;
}

export interface SaveMenuResponse {
    num_items?: number;
    [key: string]: unknown;
}

export interface ApiMessage {
    type: 'success' | 'error' | 'warning' | 'info';
    text: string;
}

export type ActiveTab = 'MenuRegular' | 'ArmaTuAlmuerzo' | 'Reservas';

// Props para componentes hijos

export interface AdminSidebarProps {
    activeTab: ActiveTab;
    handleTabClick: (tab: ActiveTab) => void;
    handleLogout: () => void;
    toggleSidebar: () => void;
    isSidebarOpen: boolean;
}

export interface TabContentProps {
    activeTab: ActiveTab;
    menuList: MenuItem[];
    newIngredient: MenuItem;
    apiMessage: ApiMessage | null;
    isSaving: boolean;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleAddIngredient: (e: React.FormEvent<HTMLFormElement>) => void;
    handleDeleteIngredient: (index: number) => void;
    handleSaveMenu: () => Promise<void>;
    styles: { readonly [key: string]: string }; // Para CSS Modules
}

// Props para el componente de contenido de 'ArmaTuAlmuerzo'
export type BuildYourLunchContentProps = Omit<TabContentProps, 'activeTab'>;

export type MenuState = {
    menuList: MenuItem[];
    newIngredient: MenuItem;
    apiMessage: ApiMessage | null;
    isSaving: boolean;
};

// Props para el nuevo componente ReservationsContent
export interface ReservationItem {
    id: string;
    name: string;
    date: string; // ISO date string
    numberOfPeople: number;
    phone: string;
    email: string;
    reason?: string;
    timestamp: string; // ISO timestamp string
    reservationType: string;
}

export interface ReservationsContentProps {
    reservationsList: ReservationItem[];
    handleEditReservation: (id: string, updatedItem: Partial<ReservationItem>) => void;
    handleDeleteReservation: (index: number) => void;
    handleSaveReservations: () => Promise<void>;
    isSaving: boolean;
    apiMessage: ApiMessage | null;
    styles: { readonly [key: string]: string };
}

export type MenuAction =
    | { type: 'SET_MENU_LIST'; payload: MenuItem[] }
    | { type: 'UPDATE_NEW_INGREDIENT'; payload: { name: string; value: string | number } }
    | { type: 'RESET_NEW_INGREDIENT' }
    | { type: 'ADD_INGREDIENT'; payload: MenuItem }
    | { type: 'DELETE_INGREDIENT'; payload: number } // payload es el index
    | { type: 'SET_API_MESSAGE'; payload: ApiMessage | null }
    | { type: 'SET_IS_SAVING'; payload: boolean };

export interface SaveReservationsResponse {
    success: boolean;
    message: string;
}