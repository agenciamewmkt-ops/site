const SPREADSHEET_ID = "17ZtluDq5HRBflMVvMnCx9Shb4q0nnPmEb56foCle3N4";
const TAB = "Leads";
const HEADERS = ["Data de recebimento","Nome","Empresa","WhatsApp","Serviço desejado","Investimento previsto","Ciência da política","Versão da política","Origem","Status"];

function setupMew() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(TAB);
  if (!sheet) throw new Error("Aba Leads não encontrada.");
  sheet.getRange(1,1,1,HEADERS.length).setValues([HEADERS]);
  sheet.setFrozenRows(1);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const body = JSON.parse(e?.postData?.contents || "{}");
    const secret = PropertiesService.getScriptProperties().getProperty("MEW_SHEETS_SECRET");
    if (!secret || secret !== body.secret) return result({ ok: false, error: "unauthorized" });
    if (![body.nome,body.empresa,body.whatsapp,body.servico].every(x => typeof x === "string" && x.trim())
      || body.consent !== true) return result({ok:false,error:"invalid"});
    lock.waitLock(15000);
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(TAB);
    if (!sheet) throw new Error("Aba Leads não encontrada");
    const safe = (v, max=200) => {
      const str = String(v||"").trim().slice(0,max);
      return /^[=+\-@]/.test(str) ? "'" + str : str;
    };
    sheet.appendRow([
      new Date(),safe(body.nome,100),safe(body.empresa,120),safe(body.whatsapp,15),
      safe(body.servico,120),safe(body.investimento,100),"Sim",
      safe(body.policyVersion,30),safe(body.source,20),"Novo"
    ]);
    return result({ok:true});
  } catch (error) {
    console.error(error);
    return result({ok:false,error:"server_error"});
  } finally {
    try { lock.releaseLock(); } catch {}
  }
}
function result(object) {
  return ContentService.createTextOutput(JSON.stringify(object))
    .setMimeType(ContentService.MimeType.JSON);
}
