<#
.SYNOPSIS
  Initialise and link a Supabase project for local development setup.
.DESCRIPTION
  Runs `supabase init` (if config.toml is missing) and `supabase link`
  to associate the local repo with a remote Supabase project.
  Pass -ProjectRef or you will be prompted for it.
.PARAMETER ProjectRef
  The Supabase project reference (e.g. abcdefghijklmnopqrst).
  Found in your project's Settings > General > Reference ID.
#>

param([string]$ProjectRef)

$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location -LiteralPath $root

# Ensure supabase CLI is available
if (-not (Get-Command supabase -ErrorAction SilentlyContinue)) {
  if (-not (Get-Command npx -ErrorAction SilentlyContinue)) {
    Write-Error "supabase CLI not found. Install it: npm install -g supabase"
    exit 1
  }
  $supabase = "npx supabase"
} else {
  $supabase = "supabase"
}

# Init if config.toml is missing
if (-not (Test-Path "$root/supabase/config.toml")) {
  Write-Host "==> Running supabase init --force" -ForegroundColor Cyan
  Invoke-Expression "$supabase init --force"
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
} else {
  Write-Host "==> supabase/config.toml already exists, skipping init" -ForegroundColor Yellow
}

# Prompt for project ref if not provided
if (-not $ProjectRef) {
  $ProjectRef = Read-Host "Enter Supabase project reference ID"
  if (-not $ProjectRef) { Write-Error "Project reference required"; exit 1 }
}

Write-Host "==> Linking project $ProjectRef" -ForegroundColor Cyan
Invoke-Expression "$supabase link --project-ref $ProjectRef"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Done. Project $ProjectRef is linked." -ForegroundColor Green
