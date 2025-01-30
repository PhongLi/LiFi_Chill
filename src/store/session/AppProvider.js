import React, { useState, createContext, useReducer } from 'react';
import { logger } from '~/utils/logger';
import reducer, { INITIAL_STATE } from './reducer';

export const AppContext = createContext();

function AppProvider({ children }) {
    const [modalType, setModalType] = useState();
    const [menuActive, setMenuActive] = useState();
    const [sessionState, sessionDispatch] = useReducer(logger(reducer), INITIAL_STATE);

    const value = {
        modalType,
        setModalType,
        menuActive,
        setMenuActive,
        session: [sessionState, sessionDispatch],
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export default AppProvider;
