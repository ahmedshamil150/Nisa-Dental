param(
  [Parameter(Mandatory)][string]$Username,
  [Parameter(Mandatory)][string]$Password
)

$nodeScript = @"
const {scryptSync,randomBytes}=require('crypto');
const s=randomBytes(16).toString('hex');
console.log(s+':'+scryptSync(process.argv[1],s,64).toString('hex'));
"@

$hash = node -e $nodeScript -- "$Password"

Write-Host "`n=== INSERT for new user ==="
Write-Host "INSERT INTO admin_users (username, password_hash)"
Write-Host "VALUES ('$Username', '$hash');"
Write-Host ""
Write-Host "=== UPDATE for existing user ==="
Write-Host "UPDATE admin_users SET password_hash = '$hash' WHERE username = '$Username';"
Write-Host ""
