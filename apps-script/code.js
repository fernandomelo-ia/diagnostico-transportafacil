/**
 * Google Apps Script — Diagnóstico TransportaFácil
 *
 * COMO USAR:
 * 1. Abra o Google Drive e crie uma Google Planilha (Sheets)
 * 2. Copie o ID da planilha da URL: .../spreadsheets/d/{SHEET_ID}/edit
 * 3. Cole o ID no campo SHEET_ID abaixo
 * 4. No menu: Extensões → Apps Script
 * 5. Cole TODO este código no editor
 * 6. Clique em Implantar → Nova implantação
 *    - Tipo: Aplicativo da Web
 *    - Executar como: Eu mesmo
 *    - Quem pode acessar: Qualquer pessoa
 * 7. Clique em Implantar → Copie a URL gerada
 * 8. Cole a URL no arquivo index.html na variável GOOGLE_SCRIPT_URL
 */

const SHEET_ID   = 'COLE_AQUI_O_ID_DA_SUA_PLANILHA'; // ← substitua isso
const SHEET_NAME = 'Respostas';

// Cabeçalhos das colunas (mesma ordem que o formulário envia)
const HEADERS = [
  'Data', 'Hora', 'Empresa', 'Respondente', 'Cargo', 'Email',
  // Bloco 0
  '0.1 Porte da Frota', '0.2 Num Colaboradores', '0.3 Segmento',
  '0.4 Estados', '0.5 TMS Atual',
  // Bloco 1 — Frota
  '1.1 Controle Manutenção', '1.2 Docs Veículos', '1.3 Combustível',
  '1.4 Custo por Veículo', '1.5 Rastreamento', '1.6 Dor Frota', '1.7 Prio Frota',
  // Bloco 2 — Financeiro
  '2.1 Contas PagRec', '2.2 Fluxo Caixa', '2.3 Margem Lucro',
  '2.4 Inadimplência', '2.5 Conciliação', '2.6 Centros de Custo',
  '2.7 Dor Financeira', '2.8 Prio Financeiro',
  // Bloco 3 — RH
  '3.1 Jornada Motoristas', '3.2 Docs Motoristas', '3.3 Treinamentos',
  '3.4 Produtividade', '3.5 Custo Colaborador', '3.6 Absenteísmo',
  '3.7 Dor RH', '3.8 Prio RH',
  // Bloco 4 — Gerencial
  '4.1 Painel Indicadores', '4.2 Custo por KM', '4.3 Disponib Frota',
  '4.4 Decisões por Dados', '4.5 KPIs Necessários', '4.6 Prio Gerencial',
  // Bloco 5 — Tecnologia
  '5.1 Manter TMS Atual', '5.2 Maior Obstáculo', '5.3 Acesso Preferido',
  '5.4 Integrações', '5.5 Prazo Resultado',
  // Bloco 6 — Priorização
  '6.1 Rank 1', '6.1 Rank 2', '6.1 Rank 3', '6.1 Rank 4',
  '6.2 Prioridade 90 Dias', '6.3 Frase da Empresa',
  // Campo aberto
  'Observações'
];

// ── GET: health check ─────────────────────────────────────────────
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'API ativa' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── POST: recebe dados do formulário ──────────────────────────────
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss    = SpreadsheetApp.openById(SHEET_ID);
    let sheet   = ss.getSheetByName(SHEET_NAME);

    // cria a aba se não existir e adiciona cabeçalhos
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length)
           .setBackground('#1a3a5c')
           .setFontColor('#ffffff')
           .setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    // monta a linha na mesma ordem dos HEADERS
    const row = HEADERS.map(h => data[h] !== undefined ? data[h] : '');
    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
