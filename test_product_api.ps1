# Test product creation
Write-Host "Testing product creation:"
$response = Invoke-RestMethod -Uri 'http://localhost:3000/api/products' `
  -Method Post `
  -ContentType 'application/json' `
  -Body '{"name": "Premium Indicator", "description": "Advanced trading indicator", "price": 2999}'

$response | ConvertTo-Json
$id = $response.id

# Test getting product
Write-Host "`nTesting get product:"
Invoke-RestMethod -Uri "http://localhost:3000/api/products/$id" | ConvertTo-Json

# Test updating product
Write-Host "`nTesting product update:"
Invoke-RestMethod -Uri "http://localhost:3000/api/products/$id" `
  -Method Put `
  -ContentType 'application/json' `
  -Body '{"name": "Premium Trading Indicator V2"}' | ConvertTo-Json

# Test search
Write-Host "`nTesting search:"
Invoke-RestMethod -Uri 'http://localhost:3000/api/search?q=trading' | ConvertTo-Json

# Test deletion (only if in DRAFT state)
Write-Host "`nTesting deletion:"
Invoke-RestMethod -Uri "http://localhost:3000/api/products/$id" -Method Delete | ConvertTo-Json
