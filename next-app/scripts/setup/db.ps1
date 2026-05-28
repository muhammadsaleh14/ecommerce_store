<#
.SYNOPSIS
  Push all local migrations to the linked Supabase project.
.DESCRIPTION
  Runs `supabase db push` to apply all migration files in
  supabase/migrations/ to the remote database.
#>

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

if (-not (Test-Path "$root/supabase/.temp/project-ref")) {
  Write-Error "No linked project found. Run scripts/setup/init.ps1 first."
  exit 1
}

Write-Host "==> Pushing migrations to remote database" -ForegroundColor Cyan
Invoke-Expression "$supabase db push"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Migrations applied." -ForegroundColor Green
