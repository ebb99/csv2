# ngrok-neu.ps1 - sicheres, bereinigtes Skript
Write-Host "Überprüfe laufende ngrok-Prozesse..." -ForegroundColor Cyan
$ngrokProzesse = Get-Process ngrok -ErrorAction SilentlyContinue

if ($ngrokProzesse) {
    Write-Host "Beende alte ngrok-Prozesse..." -ForegroundColor Yellow
    $ngrokProzesse | Stop-Process -Force
    Start-Sleep -Seconds 2
    Write-Host "Alle alten ngrok-Prozesse beendet." -ForegroundColor Green
} else {
    Write-Host "Keine laufenden ngrok-Prozesse gefunden." -ForegroundColor Green
}

Write-Host "Starte neuen ngrok-Tunnel auf Port 5000..." -ForegroundColor Cyan
Start-Process ngrok -ArgumentList "http 5000" -NoNewWindow

Start-Sleep -Seconds 3

try {
    $response = Invoke-RestMethod -Uri "http://127.0.0.1:4040/api/tunnels"
    $url = $response.tunnels.public_url
    if ($url) {
        Write-Host "Tunnel läuft unter: $url" -ForegroundColor Green
    } else {
        Write-Host "Konnte keine URL abrufen – ngrok eventuell nicht gestartet?" -ForegroundColor Red
    }
}
catch {
    Write-Host "Keine Antwort von ngrok (http://127.0.0.1:4040). Eventuell blockiert?" -ForegroundColor Red
}
Unnamed repository; edit this file 'description' to name the repository.
