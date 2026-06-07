import Route from "../models/Route.js";

let activeRoutes=[]

export async function loadRoutes() {
    try {
        const routes=await Route.find({active:true})
        activeRoutes=routes.map(r=>({
            path:      r.path,
      target:    r.target,
      auth:      r.auth,
      roles:     r.roles,
      active:    r.active,
      rateLimit: r.rateLimit

        }))
         console.log(`[ROUTES] Loaded ${activeRoutes.length} routes from MongoDB`)
    return activeRoutes
        
    } catch (error) {
        console.log('Failed',error.message)
        return []
        
    }

    
}
export function getRoutes(){
    return activeRoutes
}


export async function watchRoutes(){
    try{
        const changeStream=Route.watch()
        changeStream.on('change',async(change)=>{
            console.log(`[ROUTES] Change detected — ${change.operationType}`)
            await loadRoutes()
            console.log(`[ROUTES] Hot reloaded — ${activeRoutes.length} active routes`)

        })
        changeStream.on('error', (err) => {
      console.error('[ROUTES] Change stream error:', err.message)
    })

    console.log('[ROUTES] Watching MongoDB for route changes...')

    }catch(err){
        console.error('[ROUTES] Failed to start watch:', err.message)

    }

}
