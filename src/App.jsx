import { useState } from 'react'
import './App.css'
import { X } from 'lucide-react';
import AddButton from './components/Add-Button'
import DashBoard from './components/DashBoard'

function App() {
  const [IsAddOpen, setIsAddOpen] = useState(false)
  return (
    <div className="relative w-screen h-screen bg bg-zinc-950">
      {/*Title*/}
      <DashBoard/>
      <AddButton size={64} Click={() => {setIsAddOpen(true)}}
      className="absolute bottom-7 right-7 border border-zinc-950 rounded-full color-zinc-950 bg-white hover:bg-gray-500 hover:scale-110 transition-transform duration-200"/>

      {/*Add CSV popup*/}
      {IsAddOpen && ( 
        <> 
          <div className="fixed inset-0 bg-black/60 z-40"> </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-800 h-[70vh] w-[30vw] z-50">  
            <div className="flex flex-row items-center h-[10%]"> 
              <div className='text-white p-5 text-2xl'> Add Your CSV Below </div>
              <X size={50} color="red" onClick={() => {setIsAddOpen(false)}}
              className="flex ml-auto pr-5"> </X>
            </div>
            <div> </div>
          </div>
        </>
      )}
    </div>
  )
}

export default App
