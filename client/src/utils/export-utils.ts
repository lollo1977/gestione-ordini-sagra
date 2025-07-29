import type { DailyStats } from "@shared/schema";

// Generate Word document content (RTF format for better compatibility)
export function generateWordDocument(stats: DailyStats, date: string): string {
  const rtfContent = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}
\\f0\\fs24 REPORT GIORNALIERO - CRCS BERGEGGI\\par
\\par
Data: ${date}\\par
\\par
{\\b RIEPILOGO GENERALE}\\par
• Incasso Totale: €${stats.totalRevenue.toFixed(2)}\\par
• Ordini Totali: ${stats.totalOrders}\\par
\\par
{\\b VENDITE PER PIATTO}\\par
${stats.dishSales.map(sale => 
  `• ${sale.dish.name}: ${sale.quantity} pz - €${sale.revenue.toFixed(2)}\\par`
).join('')}
\\par
{\\b METODI DI PAGAMENTO}\\par
• Contanti: €${stats.paymentStats.cash.amount.toFixed(2)} (${stats.paymentStats.cash.percentage.toFixed(1)}%)\\par
• POS: €${stats.paymentStats.pos.amount.toFixed(2)} (${stats.paymentStats.pos.percentage.toFixed(1)}%)\\par
\\par
Generato il: ${new Date().toLocaleString('it-IT')}\\par
}`;
  
  return rtfContent;
}

// Generate Excel CSV format
export function generateExcelDocument(stats: DailyStats, date: string): string {
  const csvContent = `REPORT GIORNALIERO - CRCS BERGEGGI
Data,${date}

RIEPILOGO GENERALE
Incasso Totale,€${stats.totalRevenue.toFixed(2)}
Ordini Totali,${stats.totalOrders}

VENDITE PER PIATTO
Piatto,Quantità,Ricavo
${stats.dishSales.map(sale => 
  `"${sale.dish.name}",${sale.quantity},€${sale.revenue.toFixed(2)}`
).join('\n')}

METODI DI PAGAMENTO
Metodo,Importo,Percentuale
Contanti,€${stats.paymentStats.cash.amount.toFixed(2)},${stats.paymentStats.cash.percentage.toFixed(1)}%
POS,€${stats.paymentStats.pos.amount.toFixed(2)},${stats.paymentStats.pos.percentage.toFixed(1)}%

Generato il,${new Date().toLocaleString('it-IT')}`;
  
  return csvContent;
}

// Download file utility
export function downloadFile(content: string, filename: string, mimeType: string) {
  try {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    console.log(`File scaricato: ${filename}`);
  } catch (error) {
    console.error('Errore download file:', error);
    alert('Errore nel download del file. Riprova.');
  }
}

// Export functions
export function exportToWord(stats: DailyStats) {
  try {
    console.log('Esportazione Word iniziata', stats);
    const date = new Date().toLocaleDateString('it-IT');
    const content = generateWordDocument(stats, date);
    const filename = `report_sagra_${new Date().toISOString().split('T')[0]}.rtf`;
    downloadFile(content, filename, 'application/rtf');
  } catch (error) {
    console.error('Errore esportazione Word:', error);
    alert('Errore nell\'esportazione Word. Riprova.');
  }
}

export function exportToExcel(stats: DailyStats) {
  try {
    console.log('Esportazione Excel iniziata', stats);
    const date = new Date().toLocaleDateString('it-IT');
    const content = generateExcelDocument(stats, date);
    const filename = `report_sagra_${new Date().toISOString().split('T')[0]}.csv`;
    downloadFile(content, filename, 'text/csv');
  } catch (error) {
    console.error('Errore esportazione Excel:', error);
    alert('Errore nell\'esportazione Excel. Riprova.');
  }
}