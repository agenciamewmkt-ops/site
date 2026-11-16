export default async function handler(req,res) {
  res.setHeader("Cache-Control","no-store");
  if(req.method!=="GET")return res.status(405).json({ok:false});
  const endpoint=process.env.GOOGLE_APPS_SCRIPT_URL;
  const secret=process.env.MEW_SHEETS_SECRET;
  if(!endpoint||!secret)return res.status(503).json({ok:false,phase:"missing_environment"});
  try {
    const control=new AbortController();
    const t=setTimeout(()=>control.abort(),8500);
    let response;
    try {
      response=await fetch(endpoint,{
        method:"POST",
        headers:{"Content-Type":"text/plain;charset=utf-8"},
        body:JSON.stringify({
          secret,
          nome:"TESTE MEW INTEGRACAO",
          empresa:"TESTE DE INTEGRACAO",
          whatsapp:"11999999999",
          servico:"Marketing e gestão de redes sociais",
          investimento:"Ainda não definido",
          consent:true,
          policyVersion:"2026-11",
          source:"teste-tecnico",
          receivedAt:new Date().toISOString()
        }),
        redirect:"follow",
        signal:control.signal
      });
    } finally {clearTimeout(t)}
    const json=await response.json().catch(()=>null);
    return res.status(response.ok&&json?.ok===true?200:502).json({ok:response.ok&&json?.ok===true,phase:"google_sheets",upstreamStatus:response.status,upstreamResult:json?.error||json?.ok||null});
  } catch(e) {
    return res.status(502).json({ok:false,phase:"transport",errorName:e.name});
  }
}