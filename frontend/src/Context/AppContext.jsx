import { createContext } from "react";
import { bestSeller } from "../assets/assets";


export const AppContext = createContext();

const AppContextProvider = (props) => {


  const values = {
    bestSeller
  }

  return (
    <AppContext.Provider value={values}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppContextProvider