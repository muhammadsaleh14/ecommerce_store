<#
.SYNOPSIS
  Complete Supabase project setup: init, link, migrate, and seed.
.DESCRIPTION
  Runs init → db push → seed in sequence.
  Use this to bootstrap a brand-new Supabase project from scratch.
.PARAMETER ProjectRef
  Supabase project reference ID. Required for first-time setup.
.PARAMETER Email
  Admin email address for the seed script.
.PARAMETER Password
  Admin password for the seed script.
.EXAMPLE
  .\scripts\setup\all.ps1 -ProjectRef abcdefghijklmnopqrst
  .\scripts\setup\all.ps1 -ProjectRef abcdefghijklmnopqrst -Email admin@example.com -Password mypass
#>

param(
  [string]$ProjectRef,
  [string]$Email,
  [string]$Password
)

$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)

# --- init & link ---
& "$PSScriptRoot/init.ps1" -ProjectRef $ProjectRef
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

# --- push migrations ---
& "$PSScriptRoot/db.ps1"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

# --- seed ---
$seedArgs = @()
if ($Email) { $seedArgs += "-Email"; $seedArgs += $Email }
if ($Password) { $seedArgs += "-Password"; $seedArgs += $Password }
& "$PSScriptRoot/seed.ps1" @seedArgs
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "`nAll done. Project is fully set up." -ForegroundColor Green
