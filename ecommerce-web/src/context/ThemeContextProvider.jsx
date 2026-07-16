import React, { createContext, useEffect, useState } from 'react'
export const ThemeCotext = createContext()

// Cung cấp trạng thái giao diện sáng hoặc tối cho các component con.
const ThemeContextProvider = ({children}) => {
    const [theme, setTheme] = useState('dark')

    useEffect(() => {
        if(theme === "dark") {
            document.documentElement.classList.add("dark")
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [theme])

    // Chuyển đổi giữa giao diện sáng và giao diện tối.
    const toggleTheme = () => {
        setTheme(theme === "light" ? 'dark' : 'light')
    }
  return (
    <ThemeCotext.Provider value={{theme, toggleTheme}}>
        {children}
    </ThemeCotext.Provider>
  )
}

export default ThemeContextProvider;