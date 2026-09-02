import { Circle } from 'lucide-react';

export default function DashBoard() {
    return (
        <div className="flex flex-row p-4 gap-10 bg bg-zinc-900/30 text-xl text-white items-center justify-center ">
            <div className="absolute left-8 w-100% text-white text-4xl"> Keel   </div>
            <div> Home </div>
            <div> Overview </div>
            <div> Statistics </div>
            <Circle size={40}  strokeWidth={1} className="absolute right-8" />
        </div>
    )
}