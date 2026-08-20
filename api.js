// ============================================================
//  Unfollow Wall — tiny client for the realtime backend.
//  Shared by the wall (index.html) and the phone page (submit.html).
// ============================================================
window.UW = (function(){
  const CFG  = window.UNFOLLOW_CONFIG;
  const BASE = (CFG.API_BASE || "").replace(/\/+$/, "");
  const configured = BASE && !BASE.includes("REPLACE_ME");

  const url = p => BASE + p;

  // Is the backend awake? The wall calls this on load so the host finds out
  // before a session instead of while the room is scanning.
  async function health(){
    if(!configured) return { ok:false, reason:"not-configured" };
    try{
      const r = await fetch(url("/health"), { cache:"no-store" });
      if(!r.ok) return { ok:false, reason:"http-"+r.status };
      return { ok:true };
    }catch(e){
      return { ok:false, reason:"unreachable" };
    }
  }

  async function list(room){
    const r = await fetch(url(`/rooms/${encodeURIComponent(room)}/submissions`), { cache:"no-store" });
    if(!r.ok) throw new Error("list failed");
    return (await r.json()).submissions || [];
  }

  async function add(room, text){
    const r = await fetch(url(`/rooms/${encodeURIComponent(room)}/submissions`), {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ text }),
    });
    if(!r.ok) throw new Error("add failed");
    return r.json();
  }

  async function clear(room){
    const r = await fetch(url(`/rooms/${encodeURIComponent(room)}/submissions`), { method:"DELETE" });
    if(!r.ok) throw new Error("clear failed");
  }

  // Live feed. Reconnects on drop so a flaky room wifi doesn't silently
  // stop the wall from receiving cards mid-session.
  function subscribe(room, onMessage, onState){
    if(!configured) return { close(){} };
    let ws = null, closed = false, retry = 1000;

    function connect(){
      if(closed) return;
      const wsUrl = BASE.replace(/^http/, "ws") + `/ws/${encodeURIComponent(room)}`;
      ws = new WebSocket(wsUrl);
      ws.onopen    = () => { retry = 1000; onState && onState(true); };
      ws.onmessage = e => { try{ onMessage(JSON.parse(e.data)); }catch(_){} };
      ws.onclose   = () => {
        onState && onState(false);
        if(closed) return;
        setTimeout(connect, retry);
        retry = Math.min(retry * 2, 15000);   // back off, cap at 15s
      };
      ws.onerror   = () => { try{ ws.close(); }catch(_){} };
    }
    connect();
    return { close(){ closed = true; try{ ws && ws.close(); }catch(_){} } };
  }

  return { configured, BASE, health, list, add, clear, subscribe };
})();
