import { useState } from 'react'
import { useEffect } from 'react'
import { useRef } from 'react';
import './App.css'
import { X } from 'lucide-react';
import ProcessData from "./components/Data"
import Button from '@mui/material/Button';  
import AddButton from './components/Add-Button'
import DashBoard from './components/DashBoard'

function App() {
  const [IsAddOpen, setIsAddOpen] = useState(false)
  const DownloadRef = useRef(null)

  useEffect(() => {
    if (!IsAddOpen) return

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setIsAddOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [IsAddOpen])


  return (
    <div className="relative w-screen h-screen bg bg-zinc-950">
      {/*Title*/}
      <DashBoard/>
      <AddButton size={44} Click={() => {setIsAddOpen(true)}}
      className="absolute bottom-7 right-7 p-2 border border-zinc-950 rounded-full color-zinc-950 bg-white hover:bg-zinc-500 hover:scale-110 transition-transform duration-200"/>

      {/*Add CSV popup*/}
      {IsAddOpen && ( 
        <> 
          <div className="fixed inset-0 bg-black/60 z-40"> </div>
          <div className="flex flex-col absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-800 h-[12vh] w-[20vw] z-50">  
            <div className="flex flex-row items-center h-[50%]"> 
              <div className='flex text-white p-4 text-2xl'> Add Your CSV Below </div>
              <X size={50} color="#71717a" onClick={() => {setIsAddOpen(false)}}
              className="flex ml-auto pr-5"> </X>
            </div>
            <input 
            type='file'
            className='absolute opacity-0'
            ref={DownloadRef}
            onChange={(e) => {
              {/* Picks only on file for now */}
              console.log(ProcessData(e.target.files[0]))
            }}
            />
            <Button variant="outlined"
            onClick={() => {
              if (!DownloadRef.current) return;
              DownloadRef.current.click()}}
            className="!flex !flex-col !w-[70%] !self-center"> Click To Add </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default App
