import { MOCK_BARCODE_DATABASE } from '../data/mockMedDatabase';

/**
 * Service for decoding drug barcodes and fetching medication details
 */
export async function lookupBarcode(barcode) {
  const cleanedBarcode = String(barcode).trim();
  if (!cleanedBarcode) {
    throw new Error('Please enter or scan a valid barcode number.');
  }

  // 1. Check pre-seeded database
  const localMatch = MOCK_BARCODE_DATABASE.find(item => item.barcode === cleanedBarcode);
  if (localMatch) {
    return {
      found: true,
      source: 'Local Drug Database',
      medication: { ...localMatch }
    };
  }

  // 2. Query OpenFDA Public API for US FDA recognized drug barcodes (UPC / NDC)
  try {
    const fdaUrl = `https://api.fda.gov/drug/label.json?search=openfda.package_ndc:"${cleanedBarcode}"+OR+openfda.upc:"${cleanedBarcode}"&limit=1`;
    const response = await fetch(fdaUrl);
    
    if (response.ok) {
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const item = data.results[0];
        const brandName = item.openfda?.brand_name?.[0] || item.openfda?.generic_name?.[0] || 'Unknown Drug';
        const dosageForm = item.openfda?.dosage_form?.[0] || 'Tablets';
        const activeIng = item.active_ingredient?.[0] || '';

        return {
          found: true,
          source: 'OpenFDA Drug Database',
          medication: {
            barcode: cleanedBarcode,
            name: brandName,
            brand: item.openfda?.manufacturer_name?.[0] || '',
            category: guessCategoryFromName(brandName + ' ' + activeIng),
            form: capitalizeFirst(dosageForm),
            unit: 'pills',
            defaultQuantity: 20,
            location: 'Medicine Cabinet',
            notes: activeIng ? `Active ingredient: ${activeIng}` : 'Scanned via OpenFDA'
          }
        };
      }
    }
  } catch (error) {
    console.warn('OpenFDA API lookup skipped/unreachable:', error);
  }

  // 3. Fallback template for unrecognized barcodes
  return {
    found: false,
    source: 'Unrecognized Barcode',
    medication: {
      barcode: cleanedBarcode,
      name: `Medication (${cleanedBarcode.slice(-4)})`,
      brand: '',
      category: 'Other',
      form: 'Tablets',
      unit: 'pills',
      defaultQuantity: 10,
      location: 'Medicine Cabinet',
      notes: `Scanned code: ${cleanedBarcode}`
    }
  };
}

function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function guessCategoryFromName(text = '') {
  const lower = text.toLowerCase();
  if (lower.includes('pain') || lower.includes('ibuprofen') || lower.includes('paracetamol') || lower.includes('aspirin') || lower.includes('tylenol')) return 'Pain Relief';
  if (lower.includes('allergy') || lower.includes('cetirizine') || lower.includes('loratadine')) return 'Allergy';
  if (lower.includes('cough') || lower.includes('cold') || lower.includes('flu') || lower.includes('decongestant')) return 'Cold & Flu';
  if (lower.includes('amoxicillin') || lower.includes('antibiotic') || lower.includes('cillin')) return 'Antibiotics';
  if (lower.includes('vitamin') || lower.includes('calcium') || lower.includes('zinc')) return 'Vitamins';
  return 'Other';
}
