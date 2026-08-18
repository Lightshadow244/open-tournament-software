import type { Tournaments } from '$lib/types/tournament';


export function updateTournaments(tts:Tournaments ){
    if (typeof localStorage !== 'undefined'){
            localStorage.setItem("tournaments", JSON.stringify(tts))
        }
}

export function loadTournaments(){
    let tts = {};
    if (typeof localStorage !== 'undefined'){
        if (localStorage.getItem("tournaments") != null) {
            tts =  JSON.parse(localStorage.getItem("tournaments") as string);
            console.log("test2")
        }  
    }else{
        console.log("localstorage undefined")
    }
    return(tts)
}