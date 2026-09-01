"use client"
import { useState, useEffect } from "react"

export default function Home() {
  const [search, setSearch] = useState("horror")
  const [films, setFilms] = useState<any[]>([])
  const [playing, setPlaying] = useState<any>(null)

  useEffect(() => {
    // Cherche des vrais films complets légaux sur archive.org
    fetch(`https://archive.org/advancedsearch.php?q=(${search}) AND mediatype:movies AND collection:(feature_films OR classic_tv)&fl=identifier,title,year&rows=30&page=1&output=json`)
      .then(r=>r.json())
      .then(d=> setFilms(d.response?.docs || []))
  }, [search])

  if (playing) {
    return (
      <div style={{background:"black", minHeight:"100vh"}}>
        <div style={{padding:12}}>
          <button onClick={()=>setPlaying(null)} style={{background:"#222", color:"white", padding:"8px 14px", borderRadius:20, border:0}}>← Retour</button>
        </div>
        <iframe src={`https://archive.org/embed/${playing.identifier}`} style={{width:"100%", height:"70vh", border:0}} allowFullScreen />
        <div style={{padding:16}}>
          <h2 style={{color:"white", fontSize:16}}>{playing.title}</h2>
          <p style={{color:"#22c55e", fontSize:12}}>● FILM COMPLET {playing.year || ""} - Regarde en entier sur ton site</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{background:"#0a0a0a", minHeight:"100vh", padding:14}}>
      <h1 style={{color:"white", fontWeight:"bold", fontSize:18}}>PRINCE X KAIRO - FILMS COMPLETS</h1>
      <p style={{color:"#888", fontSize:11, marginTop:4}}>Tape un mot et regarde le film complet chez toi</p>
      
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Ex: horror, action, comedy, kung fu..." style={{width:"100%", padding:14, borderRadius:10, marginTop:12, background:"#1a1a1a", color:"white", border:"1px solid #333"}} />
      
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:16}}>
        {films.map((f:any)=>(
          <div key={f.identifier} onClick={()=>setPlaying(f)} style={{background:"#1a1a1a", borderRadius:10, overflow:"hidden", cursor:"pointer", padding:10}}>
            <div style={{height:100, background:"#222", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center"}}>
              <span style={{color:"white", fontSize:12, textAlign:"center"}}>▶</span>
            </div>
            <p style={{color:"white", fontSize:11, marginTop:6, height:36, overflow:"hidden"}}>{f.title}</p>
            <p style={{color:"#22c55e", fontSize:10, fontWeight:"bold"}}>REGARDER COMPLET</p>
          </div>
        ))}
      </div>
      
      {films.length===0 && <p style={{color:"#666", textAlign:"center", marginTop:30}}>Tape "action" ou "comedy" pour voir les films...</p>}
    </div>
  )
            }
