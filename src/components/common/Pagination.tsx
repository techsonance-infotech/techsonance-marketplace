import type React from "react";
import { arrow } from "../../utils/constants";

export function Pagination({setCount,count,totalPages,style}:{setCount:React.Dispatch<React.SetStateAction<number>>,count:number,totalPages:number,style?:string}) {
    console.log(count,totalPages )
    return (
        <div className={`flex justify-center items-center gap-4  mb-6 ${style}`}>
            <button onClick={()=>setCount(count>1?count-1:count)}  className={`px-4 py-2 flex  gap-3 items-center text-black rounded    ${count===1?'invert-50':'invert-0'}  `}>
               <img src={arrow} alt="" className=" rotate-180" /> Previous
            </button>
            <button onClick={()=>setCount(count<totalPages?count+1:count)} className={`px-4 py-2 flex  gap-3 items-center text-black rounded    ${count===totalPages?'invert-50':'invert-0'}  `}>
               Next <img src={arrow} alt="" /> 
            </button>
        </div>
    );
}