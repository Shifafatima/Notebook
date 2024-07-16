import { useState } from "react";
import NoteContext from "./NoteContext";

// const NoteState=(props)=>{
//     const s1={
//         "name":"Shifa",
//         "Class":"BSIT"
//     }
//     const [state,setState]=useState(s1)
//     const update=()=>{
//         setTimeout(() => {
//             setState({
//                 "name":"Shifa Fatima",
//                 "class":"Recend graduate BSIT"
//             })
            
//         }, 2000);
// return(
//     <NoteContext.Provider value={{state,update}}>
//     {props.children}
//     </NoteContext.Provider>
// )

//     }

    const NoteState=(props)=>{
    return(
        <NoteContext.Provider value={{}}>
        {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;