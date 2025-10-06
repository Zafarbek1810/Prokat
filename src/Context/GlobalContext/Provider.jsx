import React, {useCallback, useReducer} from 'react';
import GlobalContext from "./Context";

const initialState = {
    savdo_id: null,
    keshbek_id: null,
    client_id: null
}

const ACTION_TYPES = {
    KESHBEK_EDIT: "KESHBEK_EDIT",
    SAVDO_NUQTALARI_EDIT: "SAVDO_NUQTALARI_EDIT",
    SAVDO_NUQTALARI_NULL: "SAVDO_NUQTALARI_NULL",
    CLIENT_ABOUT: "CLIENT_ABOUT"
}

function reducer(state, action) {
    switch (action.type) {
        case ACTION_TYPES.SAVDO_NUQTALARI_EDIT : {
            return {
                savdo_id: action.payload
            }
        }
        case ACTION_TYPES.KESHBEK_EDIT : {
            return {
                keshbek_id: action.payload
            }
        }
        case ACTION_TYPES.SAVDO_NUQTALARI_NULL: {
            return {
                savdo_id: null
            }
        }
        case ACTION_TYPES.CLIENT_ABOUT: {
            return {
                client_id: action.payload
            }
        }
    }
}


const GlobalProvider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const savdo_edit = useCallback(
        function savdo_edit(id) {
            dispatch({
                type: ACTION_TYPES.SAVDO_NUQTALARI_EDIT,
                payload: id,
            })
        }, [])

    const savdo_null = useCallback(
        function savdo_null() {
            dispatch({
                type: ACTION_TYPES.SAVDO_NUQTALARI_NULL,
            })
        }, [])

    const keshbek_edit = useCallback(
        function savdo_null(id) {
            dispatch({
                type: ACTION_TYPES.KESHBEK_EDIT,
                payload: id,
            })
        }, [])

    const client_about = useCallback(
        function client_about(id) {
            dispatch({
                type: ACTION_TYPES.CLIENT_ABOUT,
                payload: id,
            })
        }, [])

    return (
        <GlobalContext.Provider value={{
            savdo_edit,
            savdo_null,
            keshbek_edit,
            client_about,
            state
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;
