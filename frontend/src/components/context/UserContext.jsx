import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "~/apis";

const UserContext = createContext();

export default function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const userCurrent = localStorage.getItem("user");

    useEffect(() => {
        if (userCurrent) {
            getCurrentUser().then((data) => {
                setUser(data.data);
            })
        }
    }, [])

    return (
        <UserContext.Provider value={{ user, setUser, isLoading, setIsLoading }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext);