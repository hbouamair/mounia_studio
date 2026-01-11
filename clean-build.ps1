# Script de nettoyage pour Next.js
Write-Host "Nettoyage du cache Next.js..." -ForegroundColor Yellow

# Arrêter tous les processus Node.js
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Supprimer le dossier .next
if (Test-Path .next) {
    Remove-Item -Recurse -Force .next
    Write-Host "✓ Dossier .next supprimé" -ForegroundColor Green
}

# Supprimer le cache node_modules
if (Test-Path node_modules/.cache) {
    Remove-Item -Recurse -Force node_modules/.cache
    Write-Host "✓ Cache node_modules supprimé" -ForegroundColor Green
}

Write-Host "`nNettoyage terminé ! Vous pouvez maintenant lancer 'npm run dev'" -ForegroundColor Green

