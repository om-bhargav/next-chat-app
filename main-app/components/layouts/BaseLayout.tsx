import { ChildProps } from '@/types/children'
import React from 'react'
import Navbar from '../global/Navbar'
import Footer from '../global/Footer'

export default function BaseLayout({children}:ChildProps) {
  return (
    <div className='grid'>
        <Navbar/>
        {children}
        <Footer/>
    </div>
  )
}
