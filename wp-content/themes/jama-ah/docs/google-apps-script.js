// =====================================================
// Google Apps Script - Theme License API
// =====================================================
// Deploy as Web App:
// 1. Buka Google Sheets → buat sheet "Licenses"
//    Kolom: license_key | email | site_url | status | expiry_date | activated_at | max_sites
// 2. Extensions → Apps Script → paste kode ini
// 3. Deploy → New deployment → Web app
//    - Execute as: Me
//    - Who has access: Anyone
// 4. Copy URL deployment → paste di theme sebagai API_URL
// =====================================================

const SHEET_NAME = 'Licenses';
const UPDATE_JSON_URL = 'https://your-cloudflare-pages.pages.dev/update/theme.json';

function doPost(e) {
    try {
        const params = JSON.parse(e.postData.contents);
        const action = params.action;

        switch (action) {
            case 'validate':
                return jsonResponse(validateLicense(params.license_key, params.site_url));
            case 'check-update':
                return jsonResponse(checkUpdate(params.license_key, params.site_url));
            case 'deactivate':
                return jsonResponse(deactivateLicense(params.license_key, params.site_url));
            default:
                return jsonResponse({ success: false, message: 'Invalid action' });
        }
    } catch (err) {
        return jsonResponse({ success: false, message: err.toString() });
    }
}

// Juga support GET untuk test
function doGet(e) {
    return jsonResponse({ status: 'ok', message: 'Theme License API is running' });
}

// =====================================================
// VALIDATE / ACTIVATE LICENSE
// =====================================================
function validateLicense(key, siteUrl) {
    if (!key || !siteUrl) {
        return { success: false, message: 'License key and site URL are required' };
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];

    const keyCol = headers.indexOf('license_key');
    const siteCol = headers.indexOf('site_url');
    const statusCol = headers.indexOf('status');
    const expiryCol = headers.indexOf('expiry_date');
    const activatedCol = headers.indexOf('activated_at');
    const maxSitesCol = headers.indexOf('max_sites');

    for (let i = 1; i < data.length; i++) {
        if (data[i][keyCol] === key) {
            // Cek status
            if (data[i][statusCol] === 'blocked') {
                return { success: false, message: 'License key has been blocked' };
            }

            // Cek expiry
            const expiry = new Date(data[i][expiryCol]);
            if (expiry < new Date()) {
                return { success: false, message: 'License key has expired' };
            }

            // Cek apakah sudah diaktifkan di site lain
            const existingSite = data[i][siteCol];
            const maxSites = data[i][maxSitesCol] || 1;

            if (existingSite && existingSite !== siteUrl) {
                // Cek jumlah site (comma separated)
                const sites = existingSite.split(',').filter(s => s.trim());
                if (sites.length >= maxSites && !sites.includes(siteUrl)) {
                    return {
                        success: false,
                        message: 'License key sudah digunakan di ' + sites.length + ' site (max: ' + maxSites + ')'
                    };
                }
                // Tambahkan site baru
                if (!sites.includes(siteUrl)) {
                    sites.push(siteUrl);
                    sheet.getRange(i + 1, siteCol + 1).setValue(sites.join(','));
                }
            } else {
                // Aktivasi pertama kali
                sheet.getRange(i + 1, siteCol + 1).setValue(siteUrl);
            }

            // Update activated_at jika belum
            if (!data[i][activatedCol]) {
                sheet.getRange(i + 1, activatedCol + 1).setValue(new Date().toISOString());
            }

            // Set status active
            sheet.getRange(i + 1, statusCol + 1).setValue('active');

            return {
                success: true,
                message: 'License activated successfully',
                expiry: data[i][expiryCol],
                status: 'active'
            };
        }
    }

    return { success: false, message: 'Invalid license key' };
}

// =====================================================
// CHECK UPDATE (validate + return update info)
// =====================================================
function checkUpdate(key, siteUrl) {
    if (!key) {
        return { success: false, message: 'No license key provided' };
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];

    const keyCol = headers.indexOf('license_key');
    const siteCol = headers.indexOf('site_url');
    const statusCol = headers.indexOf('status');
    const expiryCol = headers.indexOf('expiry_date');

    for (let i = 1; i < data.length; i++) {
        if (data[i][keyCol] === key) {
            if (data[i][statusCol] === 'blocked') {
                return { success: false, message: 'License blocked' };
            }

            const expiry = new Date(data[i][expiryCol]);
            if (expiry < new Date()) {
                return { success: false, message: 'License expired' };
            }

            // Cek site_url cocok
            const sites = (data[i][siteCol] || '').split(',').map(s => s.trim());
            if (siteUrl && !sites.includes(siteUrl)) {
                return { success: false, message: 'License not activated for this site' };
            }

            // Fetch update info dari Cloudflare Pages
            try {
                const response = UrlFetchApp.fetch(UPDATE_JSON_URL, { muteHttpExceptions: true });
                const updateInfo = JSON.parse(response.getContentText());

                return {
                    success: true,
                    update: {
                        new_version: updateInfo.new_version,
                        url: updateInfo.url || '',
                        package: updateInfo.package || ''
                    }
                };
            } catch (err) {
                return { success: false, message: 'Failed to fetch update info' };
            }
        }
    }

    return { success: false, message: 'Invalid license key' };
}

// =====================================================
// DEACTIVATE LICENSE
// =====================================================
function deactivateLicense(key, siteUrl) {
    if (!key) {
        return { success: false, message: 'License key is required' };
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];

    const keyCol = headers.indexOf('license_key');
    const siteCol = headers.indexOf('site_url');

    for (let i = 1; i < data.length; i++) {
        if (data[i][keyCol] === key) {
            const sites = (data[i][siteCol] || '').split(',').filter(s => s.trim());
            const remaining = sites.filter(s => s !== siteUrl);
            sheet.getRange(i + 1, siteCol + 1).setValue(remaining.join(','));

            return { success: true, message: 'License deactivated for this site' };
        }
    }

    return { success: false, message: 'License key not found' };
}

// =====================================================
// HELPER: Generate License Keys (run manually)
// =====================================================
function generateLicenseKeys(count, expiryDate, maxSites) {
    count = count || 10;
    expiryDate = expiryDate || '2027-12-31';
    maxSites = maxSites || 1;

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    for (let i = 0; i < count; i++) {
        const key = 'JMAH-' + randomBlock() + '-' + randomBlock() + '-' + randomBlock();
        sheet.appendRow([key, '', '', 'inactive', expiryDate, '', maxSites]);
    }

    Logger.log('Generated ' + count + ' license keys');
}

function randomBlock() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let block = '';
    for (let i = 0; i < 4; i++) {
        block += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return block;
}

// =====================================================
// JSON Response Helper
// =====================================================
function jsonResponse(data) {
    return ContentService
        .createTextOutput(JSON.stringify(data))
        .setMimeType(ContentService.MimeType.JSON);
}
