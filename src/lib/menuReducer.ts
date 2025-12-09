import type { MenuState, MenuAction, ApiMessage } from '../types/admin';

export const initialMenuState: MenuState = {
    menuList: [],
    newIngredient: { name: '', price: 0 },
    apiMessage: null,
    isSaving: false,
};

export function menuReducer(state: MenuState, action: MenuAction): MenuState {
    switch (action.type) {
        case 'SET_MENU_LIST':
            return {
                ...state,
                menuList: action.payload,
            };

        case 'UPDATE_NEW_INGREDIENT':
            // Lógica para manejar el input del nuevo ingrediente
            return {
                ...state,
                newIngredient: {
                    ...state.newIngredient,
                    [action.payload.name]: action.payload.value,
                },
            };

        case 'RESET_NEW_INGREDIENT':
            return {
                ...state,
                newIngredient: { name: '', price: 0 },
            };

        case 'ADD_INGREDIENT':
            // Lógica para añadir un ingrediente
            return {
                ...state,
                menuList: [...state.menuList, action.payload],
                apiMessage: { type: 'success', text: 'Ingrediente añadido a la lista.' } as ApiMessage,
            };
        
        case 'DELETE_INGREDIENT': {
            // Lógica para eliminar un ingrediente
            const updatedList = [...state.menuList];
            updatedList.splice(action.payload, 1);
            return {
                ...state,
                menuList: updatedList,
                apiMessage: { type: 'info', text: 'Ingrediente eliminado de la tabla.' } as ApiMessage,
            };
        }

        case 'SET_API_MESSAGE':
            return {
                ...state,
                apiMessage: action.payload,
            };

        case 'SET_IS_SAVING':
            return {
                ...state,
                isSaving: action.payload,
            };

        default:
            return state;
    }
}