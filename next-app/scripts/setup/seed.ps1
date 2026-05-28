<#
.SYNOPSIS
  Seed the database with sample products and create an admin user.
.DESCRIPTION
  Runs `supabase db seed` (SQL seed) followed by the TypeScript
  seed script which creates products, variants, and an admin user
  via the Supabase Auth API.
.PARAMETER Email
  Admin email address. Defaults to the SEED_ADMIN_EMAIL env var,
  or prompts if neither is set.
.PARAMETER Password
  Admin password. Defaults to SEED_ADMIN_PASSWORD env var,
  or "admin123456".
#>

param([string]$Email, [string]$Password)

$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location -LiteralPath $root

if (-not (Get-Command supabase -ErrorAction SilentlyContinue)) {
  if (-not (Get-Command npx -ErrorAction SilentlyContinue)) {
    Write-Error "supabase CLI not found. Install it: npm install -g supabase"
    exit 1
  }
  $supabase = "npx supabase"
} else {
  $supabase = "supabase"
}

# --- SQL seed (products + variants) ---
if (Test-Path "$root/supabase/seed.sql") {
  Write-Host "==> Seeding database via supabase db seed" -ForegroundColor Cyan
  Invoke-Expression "$supabase db seed"
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
} else {
  Write-Host "==> supabase/seed.sql not found, skipping SQL seed" -ForegroundColor Yellow
}

# --- TypeScript seed (admin user) ---
Write-Host "==> Running TypeScript seed (admin user + products)" -ForegroundColor Cyan
$envArgs = @()
if ($Email) { $envArgs += "SEED_ADMIN_EMAIL=$Email" }
if ($Password) { $envArgs += "SEED_ADMIN_PASSWORD=$Password" }

if ($envArgs.Count -gt 0) {
  & { $envArgs -join " " } | Out-Null
  Invoke-Expression "$($envArgs -join ' ') npx tsx scripts/seed.ts"
} else {
  npx tsx scripts/seed.ts
}

if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Seed complete." -ForegroundColor Green
