import {createContext} from "use-context-selector";


const UserContext = createContext({isAuth: false, user:null})

export  default UserContext;