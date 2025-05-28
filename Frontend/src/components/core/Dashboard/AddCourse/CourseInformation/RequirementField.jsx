import { useEffect, useState } from "react"



export default function RequirementField({name,label,register,errors,setValue,getValues}){

    const [requirement,setRequirement]=useState("");
    const [requirementList,setRequirementList]=useState([]);

    useEffect(()=>{
        register(name,{required:true,validate:(value)=>value.length > 0})
    },[])

    useEffect(()=>{
        setValue(name,requirementList)
    },[requirementList])

    const handleAddRequirement=()=>{
        if(requirement){
            setRequirementList([...requirementList,requirement]);
            setRequirement("");
        }
    }


    const handleRemoveRequirement=(index)=>{
        const updatedRequirementList=[...requirementList]
        updatedRequirementList.splice(index,1);
        setRequirementList(updatedRequirementList);
    }


    return (
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5"  htmlFor={name}>{label}<sup>*</sup></label>
            <div className="flex flex-col items-start space-y-2">
                <input className="form-style w-full" type="text" id={name} value={requirement} onChange={(e)=>setRequirement(e.target.value)}/>
                <button className="font-semibold text-yellow-50" type="button" onClick={handleAddRequirement}> Add </button>
            </div>
            {
                requirementList.length > 0 && (
                    <ul className="mt-2 list-inside list-disc">
                        {
                            requirementList.map((requirement,index)=>(
                                <li  className="flex items-center text-richblack-5" key={index}> 
                                    <span>{requirement}</span>
                                    <button className="ml-2 text-xs text-pure-greys-300 " onClick={(index)=>handleRemoveRequirement(index)}> Clear  </button>
                                </li>
                            ))
                        }
                    </ul>
                )
            }
            {
                errors[name] && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">{label } is required</span>
                )
            }
        </div>
    )
}