Get-Service -ErrorAction SilentlyContinue |
    Where-Object { $_.DisplayName -like '*Postgre*' -or $_.Name -like '*postgres*' } |
    Select-Object Name, DisplayName, Status