"use client"

import { useTheme } from 'next-themes'

export default function ThemeToggleButton(){
  const { theme, setTheme } = useTheme();

  return (
    <div>
      The current theme is: {theme}
      <button className="btn-primary" onClick={() => setTheme('light')}>Light Mode</button>
      <button className="btn-primary" onClick={() => setTheme('dark')}>Dark Mode</button>
    </div>
  )   
}