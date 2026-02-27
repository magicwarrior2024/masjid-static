// ==============================================================================
// MASJID SYSTEM - ORDER, LICENSE, & UPDATE BACKEND (GOOGLE APPS SCRIPT)
// ==============================================================================
// 1. Ganti ID Sheet & Folder di bawah dengan ID Google Drive Anda.
// 2. Publish -> Deploy as Web App -> "Execute as: Me", "Who has access: Anyone"
// ==============================================================================

var SPREADSHEET_ID = "GANTI_DENGAN_SPREADSHEET_ID_ANDA";
var FOLDER_BUKTI_PAYMENT_ID = "GANTI_DENGAN_FOLDER_ID_UNTUK_BUKTI_TRANSFER";

var SHEET_ORDERS = "Orders";     // Tab untuk menampung data order
var SHEET_LICENSES = "Licenses"; // Tab untuk menampung license key aktif

var THEME_VERSION = "2.0.0";
var THEME_UPDATE_URL = "GANTI_DENGAN_LINK_DRIVE_ZIP_THEME_ANDA_KALAU_ADA";

var PLUGIN_VERSION = "2.0.0";
var PLUGIN_UPDATE_URL = "GANTI_DENGAN_LINK_DRIVE_ZIP_PLUGIN_ANDA_KALAU_ADA";

// ==============================================================================
// ROUTING (GET / POST)
// ==============================================================================

function doPost(e) {
    try {
        var data = null;
        if (e.postData && e.postData.contents) {
            data = JSON.parse(e.postData.contents);
        } else {
            var jsonStr = e.parameter.data;
            if (jsonStr) {
                data = JSON.parse(jsonStr);
            }
        }

        if (!data || !data.action) {
            return respondError("No action defined");
        }

        switch (data.action) {
            case "submit_order":
                return handleSubmitOrder(data);
            case "generate_license":
                return handleGenerateLicense(data);
            case "validate":
                return handleValidateLicense(data);
            case "check-update":
                return handleCheckUpdate(data);
            case "deactivate":
                return handleDeactivate(data);
            default:
                return respondError("Unknown action");
        }
    } catch (error) {
        return respondError("Server Error: " + error.toString());
    }
}

function doGet(e) {
    var action = e.parameter.action;

    if (action === "license_board") {
        var token = e.parameter.token;
        if (!token) return ContentService.createTextOutput("Token tidak valid.");

        // UI Halaman Generate Lisensi
        var html = "<div style='font-family:sans-serif;max-width:500px;margin:50px auto;padding:20px;border:1px solid #ccc;border-radius:8px;'>";
        html += "<h2>Aktivasi Produk Jama-ah</h2>";
        html += "<p>Masukkan nama domain masjid Anda (contoh: <b>masjidku.com</b>) untuk men-generate License Key.</p>";
        html += "<p>Perhatian: Satu lisensi hanya untuk satu domain.</p>";

        html += "<form id='licForm'>";
        html += "<input type='hidden' id='token' value='" + token + "'>";
        html += "<input type='text' id='domain' placeholder='contoh: masjidku.com' style='width:100%;padding:10px;margin-bottom:15px;box-sizing:border-box;' required>";
        html += "<button type='submit' style='background:#00a32a;color:white;padding:10px 15px;border:none;border-radius:4px;cursor:pointer;width:100%'>Generate License Key</button>";
        html += "</form>";
        html += "<div id='result' style='margin-top:20px;padding:15px;background:#f9f9f9;border-left:4px solid #00a32a;display:none;'></div>";

        // Inject Script for Web App Post
        var appUrl = ScriptApp.getService().getUrl();
        html += "<script>";
        html += "document.getElementById('licForm').addEventListener('submit', function(e){";
        html += "e.preventDefault();";
        html += "var btn = e.target.querySelector('button'); btn.innerText = 'Memproses...'; btn.disabled = true;";
        html += "var payload = JSON.stringify({action: 'generate_license', token: document.getElementById('token').value, domain: document.getElementById('domain').value});";
        html += "fetch('" + appUrl + "', { method: 'POST', body: payload }).then(r=>r.json()).then(res=>{";
        html += "btn.innerText = 'Selesai';";
        html += "var d = document.getElementById('result'); d.style.display='block';";
        html += "if(res.success){ d.innerHTML = '<b>Aktivasi Berhasil!</b><br>License Key Anda:<br><code style=\"font-size:18px;background:#eee;padding:5px\">' + res.license_key + '</code><br><br>Gunakan key ini di WP-Admin website Anda.'; }";
        html += "else { d.innerHTML = '<b style=\"color:red\">Error:</b> ' + res.message; btn.innerText = 'Generate Lagi'; btn.disabled=false;}";
        html += "}).catch(e=>{ alert('Error connecting server.'); btn.disabled=false; btn.innerText='Generate License Key';});";
        html += "});";
        html += "</script>";
        html += "</div>";

        return HtmlService.createHtmlOutput(html).setTitle("Aktivasi Jama-ah");
    }

    return ContentService.createTextOutput("System Masjid API is running.");
}


// ==============================================================================
// 1. SUBMIT ORDER FRONTEND (BASE64 FILE TO DRIVE)
// ==============================================================================

function handleSubmitOrder(data) {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_ORDERS);
    if (!sheet) return respondError("Sheet 'Orders' not found. Please create it.");

    var name = data.name;
    var email = data.email;
    var phone = data.phone;
    var package = data.package; // e.g. "Theme Only", "Theme + Plugin"
    var fileBase64 = data.file_base64; // e.g. "data:image/jpeg;base64,/9j/4S..."
    var fileName = data.file_name || "Bukti_Bayar_" + Date.now();
    var mimeType = data.mimeData || "image/jpeg";

    var fileUrl = "";
    if (fileBase64 && fileBase64.indexOf("base64,") !== -1) {
        try {
            var base64Data = fileBase64.split("base64,")[1];
            var blob = Utilities.newBlob(Utilities.base64Decode(base64Data), mimeType, fileName);
            var folder = DriveApp.getFolderById(FOLDER_BUKTI_PAYMENT_ID);
            var fileInfo = folder.createFile(blob);
            fileInfo.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
            fileUrl = fileInfo.getUrl();
        } catch (e) {
            fileUrl = "Upload Failed: " + e.message;
        }
    }

    var token = Utilities.getUuid(); // Secret token generated, but not emailed yet until approved.
    var timestamp = new Date();

    // Columns: [Timestamp, Name, Email, Phone, Package, File URL, Status, Token]
    sheet.appendRow([timestamp, name, email, phone, package, fileUrl, "Pending", token]);

    return respondSuccess("Pesanan Anda berhasil dikirim. Menunggu verifikasi admin.");
}


// ==============================================================================
// 2. ON EDIT TRIGGER (Ubah "Pending" jadi "Approved" -> Kirim Email Token)
// ==============================================================================
// *HARUS DI-SET TRIGGERS MANUAL DI APPS SCRIPT: Edit -> Current project's triggers -> Add Trigger -> onEdit (from Spreadsheet)*
// *Tetapi onEdit(e) local function bisa mendeteksi langsung jika diizinkan.*

function onEdit(e) {
    var range = e.range;
    var sheet = range.getSheet();
    if (sheet.getName() !== SHEET_ORDERS) return;

    var col = range.getColumn();
    var row = range.getRow();

    // Jika kolom 'Status' (Asumsi kolom ke-7) diubah menjadi 'Approved'
    // Pastikan Anda menyesuaikan angka 7 bila posisi beda (Timestamp=1, Name=2, Email=3, Phone=4, Package=5, File URL=6, Status=7, Token=8)
    if (col === 7 && row > 1) {
        var status = range.getValue();
        if (status === "Approved") {
            var emailSentCol = 9; // Let's mark email sent in Column 9
            var isSent = sheet.getRange(row, emailSentCol).getValue();

            if (isSent !== "Sent") {
                var email = sheet.getRange(row, 3).getValue();
                var name = sheet.getRange(row, 2).getValue();
                var package = sheet.getRange(row, 5).getValue();
                var token = sheet.getRange(row, 8).getValue();

                var appUrl = ScriptApp.getService().getUrl();
                var generateUrl = appUrl + "?action=license_board&token=" + encodeURIComponent(token);

                var subject = "Pesanan Jama-ah Berhasil Diverifikasi! [Action Required]";
                var body = "Assalamu'alaikum " + name + ",\n\n";
                body += "Terima kasih! Pembayaran Anda untuk paket '" + package + "' telah kami terima dan diverifikasi.\n\n";
                body += "Untuk menggunakan produk, silakan klik tautan di bawah ini untuk men-generate License Key (khusus untuk domain website Anda):\n";
                body += generateUrl + "\n\n";
                body += "Jazakumullah khairan,\nTim Support Masjid";

                try {
                    MailApp.sendEmail(email, subject, body);
                    sheet.getRange(row, emailSentCol).setValue("Sent"); // Tandai email sudah kekirim
                } catch (err) {
                    sheet.getRange(row, emailSentCol).setValue("Fail: " + err.message);
                }
            }
        }
    }
}


// ==============================================================================
// 3. GENERATE LICENSE (DARI WEB APP)
// ==============================================================================

function handleGenerateLicense(data) {
    var token = data.token;
    var domain = data.domain;

    if (!token || !domain) return respondError("Data tidak lengkap.");

    // Cari order berdasarkan token
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var orderSheet = ss.getSheetByName(SHEET_ORDERS);
    var orderData = orderSheet.getDataRange().getValues();

    var orderRow = null;
    for (var i = 1; i < orderData.length; i++) {
        if (orderData[i][7] === token) { // Kolom Token
            orderRow = i + 1; // 1-index
            break;
        }
    }

    if (!orderRow) return respondError("Token tidak ditemukan atau tidak valid.");

    // Cek apakah token sudah digunakan (kolom ke 10 kita asumsikan status Used)
    var isUsed = orderSheet.getRange(orderRow, 10).getValue();
    if (isUsed === "Used") {
        return respondError("Token ini sudah pernah digunakan untuk klaim lisensi.");
    }

    var email = orderSheet.getRange(orderRow, 3).getValue();
    var packageType = orderSheet.getRange(orderRow, 5).getValue();

    // Format License: JM-YYYY-RANDOM (contoh simple)
    var newLicense = "JM-" + Utilities.getUuid().substring(0, 8).toUpperCase();

    // Simpan ke sheet Licenses
    var licenseSheet = ss.getSheetByName(SHEET_LICENSES);
    if (!licenseSheet) return respondError("Sheet 'Licenses' missing.");

    // Kolom Licenses: [License Key, Email, Domain, Package, Status, Expired At, Created At]
    var expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1); // Aktif 1 tahun

    licenseSheet.appendRow([
        newLicense,
        email,
        domain.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0], // Clean domain
        packageType,
        "active",
        expiryDate,
        new Date()
    ]);

    // Tandai token used
    orderSheet.getRange(orderRow, 10).setValue("Used");

    // Kirim copy ke email
    try {
        MailApp.sendEmail(
            email,
            "Ini License Key Anda - Jama'ah",
            "Berikut adalah License Key Anda untuk domain '" + domain + "':\n\nLicense Key: " + newLicense + "\n\nSilakan masukkan di menu lisensi WP-Admin."
        );
    } catch (err) { }

    return respondSuccess("Lisensi berhasil digenerate.", { license_key: newLicense });
}


// ==============================================================================
// 4. API VALIDASI & CEK UPDATE (DIPANGGIL OLEH TEMA/PLUGIN WORDPRESS)
// ==============================================================================

function getLicenseRow(licenseKey) {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_LICENSES);
    if (!sheet) return -1;
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
        if (data[i][0] === licenseKey) return i + 1;
    }
    return -1;
}

function handleValidateLicense(data) {
    var key = data.license_key;
    var site = data.site_url;
    var type = data.product_type || "theme"; // "theme" or "plugin"

    if (!key) return respondError("No license key provided.");

    var row = getLicenseRow(key);
    if (row === -1) return respondError("License key invalid! (Not found)");

    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_LICENSES);

    var dbDomain = sheet.getRange(row, 3).getValue();
    var dbStatus = sheet.getRange(row, 5).getValue();
    var dbExpiry = sheet.getRange(row, 6).getValue();
    // Validasi jika ada bundel bisa di-cek (optional logic)
    // var dbPackage = sheet.getRange(row, 4).getValue(); 

    // Clean request URL
    var cleanSite = site.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0];
    if (cleanSite !== dbDomain) {
        // Kalau database masih kosong domainnya (first activation), lock domain
        if (dbDomain == "" || dbDomain == null) {
            sheet.getRange(row, 3).setValue(cleanSite);
        } else {
            return respondError("License di-bind untuk domain lain (" + dbDomain + ").");
        }
    }

    var now = new Date();
    var expDate = new Date(dbExpiry);
    if (now > expDate) {
        sheet.getRange(row, 5).setValue("expired");
        return respondError("License has expired on " + expDate.toISOString().split("T")[0]);
    }

    if (dbStatus !== "active") {
        return respondError("License is not active. Status: " + dbStatus);
    }

    return respondSuccess("License is valid and active", {
        status: "active",
        expiry: expDate.toISOString().split("T")[0]
    });
}

function handleCheckUpdate(data) {
    var valResult = handleValidateLicense(data); // Re-use validasi
    var respObj = JSON.parse(valResult.getContent());

    if (!respObj.success) {
        return valResult; // Kirim errornya (invalid/expired)
    }

    var productType = data.product_type || "theme";
    var newVer = (productType === "plugin") ? PLUGIN_VERSION : THEME_VERSION;
    var zipUrl = (productType === "plugin") ? PLUGIN_UPDATE_URL : THEME_UPDATE_URL;

    var updateData = {
        new_version: newVer,
        url: "https://example.com/changelog",
        package: zipUrl
    };

    return respondSuccess("Update info retrieved", { update: updateData });
}

function handleDeactivate(data) {
    var key = data.license_key;
    if (!key) return respondError("No license key.");
    var row = getLicenseRow(key);
    if (row === -1) return respondError("License key not found.");

    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_LICENSES);

    // Reset domain binding (optional, jika user dibolehkan pindah domain saat deactivate)
    sheet.getRange(row, 3).setValue("");

    return respondSuccess("License successfully deactivated from this domain.");
}

// ==============================================================================
// HELPER RESPONSES
// ==============================================================================

function respondSuccess(message, extraData) {
    var payload = { success: true, message: message };
    if (extraData) {
        for (var k in extraData) payload[k] = extraData[k];
    }
    return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}

function respondError(message) {
    var payload = { success: false, message: message };
    return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
