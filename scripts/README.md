# Admin User Management

## Generate password hash for a new/existing user

Open PowerShell in this folder and run:

```powershell
.\generate-admin-hash.ps1 -Username "eashaappilogin" -Password "nisaeasha@150"
```

It will output both INSERT and UPDATE SQL statements — copy-paste the one you need into Supabase SQL Editor.

## Quick hash-only (no SQL output)

```bash
node -e "const {scryptSync,randomBytes}=require('crypto');const s=randomBytes(16).toString('hex');console.log(s+':'+scryptSync('yourPassword',s,64).toString('hex'))"
```
