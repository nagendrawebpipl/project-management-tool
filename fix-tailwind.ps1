$path = 'C:\MVP PM TOOL\tailwind.config.ts'
$content = Get-Content $path
$content = $content -replace 'hsl\(var\(--', 'oklch(var(--'
$content | Set-Content $path
