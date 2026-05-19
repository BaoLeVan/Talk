import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "~/apis";

const UserContext = createContext();

export default function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const userCurrent = localStorage.getItem("user");

    useEffect(() => {
        let ignore = false;

        const bootstrapUser = async () => {
            if (!userCurrent) {
                if (!ignore) setIsLoading(false);
                return;
            }

            try {
                const data = await getCurrentUser();
                if (!ignore) setUser(data.data);
            } catch (error) {
                localStorage.removeItem("user");
                if (!ignore) setUser(null);
            } finally {
                if (!ignore) setIsLoading(false);
            }
        };

        bootstrapUser();

        return () => {
            ignore = true;
        };
    }, [userCurrent])

    return (
        <UserContext.Provider value={{ user, setUser, isLoading, setIsLoading }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext);