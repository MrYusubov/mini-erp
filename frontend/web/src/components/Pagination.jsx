import React from 'react'


export default function Pagination({ page, setPage }){
return (
<div className="flex items-center space-x-2">
<button onClick={()=>setPage(p => Math.max(1, p-1))} className="px-3 py-1 border rounded">Prev</button>
<div>Page {page}</div>
<button onClick={()=>setPage(p => p+1)} className="px-3 py-1 border rounded">Next</button>
</div>
)
}