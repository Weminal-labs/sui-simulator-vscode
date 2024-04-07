import React from 'react'
import { Outlet } from 'react-router-dom'
import { Rainbow } from './components/Rainbow'

export const RootLayout = () => {
    return (
        <div className="bg-[#0e0f0e] flex flex-row justify-center w-full h-full">
            <Outlet />
            <Rainbow />
        </div>
    )
}
