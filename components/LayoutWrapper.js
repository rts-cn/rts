import React, { useEffect, useRef, useState } from 'react'
import SectionContainer from './SectionContainer'
import Footer from './Footer'

const LayoutWrapper = ({ children }) => {
  return (
    <SectionContainer>
      <div className="flex flex-col ">
        <main className="mb-auto">{children}</main>
        <Footer />
      </div>
    </SectionContainer>
  )
}

export default LayoutWrapper
