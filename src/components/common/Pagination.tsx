import type React from "react";

export function Pagination({setCount,count,totalPages}:{setCount:React.Dispatch<React.SetStateAction<number>>,count:number,totalPages:number}) {
    return (
        <div className="flex justify-center items-center gap-4 mt-6">
            <button onClick={()=>setCount(count>1?count-1:count)}  className="px-4 py-2   text-gray-700 rounded hover:text-gray-600">
              {  '<- Previous'}
            </button>
            <button onClick={()=>setCount(count<totalPages?count+1:count)} className="px-4 py-2   text-black rounded hover:text-gray-600">
               {'Next ->'}
            </button>
        </div>
    );
}