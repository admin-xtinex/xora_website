<#
.SYNOPSIS
  Sets up automatic deployment: puts the Azure Static Web Apps deployment token into the GitHub
  repository secret AZURE_STATIC_WEB_APPS_API_TOKEN, used by .github/workflows/deploy.yml.

.DESCRIPTION
  Run once, from any folder, on a computer signed in to Azure (the same one that deploys today).
  1. Reads the deployment token of the Static Web App with the Azure CLI (az).
  2. If the GitHub CLI (gh) is installed and signed in, saves it straight into the repository secret.
     Otherwise it copies the token to the clipboard and tells you where to paste it.
  The token is never printed unless you pass -Show.

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File .\scripts\setup-deploy-secret.ps1

.EXAMPLE
  .\scripts\setup-deploy-secret.ps1 -ClipboardOnly      # skip gh, just copy the token
#>
[CmdletBinding()]
param(
  [string]$AppName = "xora-website",
  [string]$ResourceGroup = "rg-xora-web",
  [string]$Repo = "admin-xtinex/xora_website",
  [string]$SecretName = "AZURE_STATIC_WEB_APPS_API_TOKEN",
  [switch]$ClipboardOnly,
  [switch]$Show
)

$ErrorActionPreference = "Stop"

function Test-Command($name) { [bool](Get-Command $name -ErrorAction SilentlyContinue) }

# 1. Azure CLI, signed in.
if (-not (Test-Command az)) {
  throw "The Azure CLI (az) is not installed. Install it from https://aka.ms/installazurecliwindows and run this script again."
}
az account show --only-show-errors 1>$null 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Signing in to Azure..." -ForegroundColor Cyan
  az login --only-show-errors 1>$null
  if ($LASTEXITCODE -ne 0) { throw "Azure sign-in failed." }
}
$account = az account show --query "{name:name, user:user.name}" -o tsv --only-show-errors
Write-Host "Azure account: $account"

# 2. The deployment token of the Static Web App.
Write-Host "Reading the deployment token of '$AppName' (resource group '$ResourceGroup')..." -ForegroundColor Cyan
$token = az staticwebapp secrets list --name $AppName --resource-group $ResourceGroup --query "properties.apiKey" -o tsv --only-show-errors
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($token)) {
  throw "Could not read the token. Check the app name and resource group, and that this account can manage the Static Web App (az account set --subscription <id> if it is in another subscription)."
}
$token = $token.Trim()
Write-Host ("Token read ({0} characters)." -f $token.Length) -ForegroundColor Green
if ($Show) { Write-Host "Token: $token" -ForegroundColor Yellow }

# 3. Save it as the repository secret.
$saved = $false
if (-not $ClipboardOnly -and (Test-Command gh)) {
  gh auth status 1>$null 2>$null
  if ($LASTEXITCODE -ne 0) {
    Write-Host "Signing in to GitHub..." -ForegroundColor Cyan
    gh auth login --hostname github.com --git-protocol https --web
  }
  if ($LASTEXITCODE -eq 0) {
    # The token goes in through standard input, so it never appears on a command line.
    $token | gh secret set $SecretName --repo $Repo
    if ($LASTEXITCODE -eq 0) {
      $saved = $true
      Write-Host "Saved the secret $SecretName in $Repo." -ForegroundColor Green
    }
  }
}

if (-not $saved) {
  Set-Clipboard -Value $token
  Write-Host ""
  Write-Host "The token is now on your clipboard. Add it to GitHub:" -ForegroundColor Yellow
  Write-Host "  1. Open https://github.com/$Repo/settings/secrets/actions/new"
  Write-Host "  2. Name:   $SecretName"
  Write-Host "  3. Secret: paste (Ctrl+V), then click 'Add secret'"
  Write-Host "  Then clear the clipboard (copy something else)."
}

# 4. Optionally start a deploy now.
if ($saved) {
  $answer = Read-Host "Deploy the current main branch now? (y/N)"
  if ($answer -match '^(y|yes)$') {
    gh workflow run deploy.yml --repo $Repo --ref main
    if ($LASTEXITCODE -eq 0) { Write-Host "Started. Watch it at https://github.com/$Repo/actions" -ForegroundColor Green }
  }
}

Write-Host ""
Write-Host "Done. From now on every push to main deploys the site automatically." -ForegroundColor Green
Write-Host "If the token is ever reset in Azure (Static Web App > Overview > Manage deployment token), run this script again."
