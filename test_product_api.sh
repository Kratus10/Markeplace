#!/bin/bash

# Test product creation
echo "Testing product creation:"
response=$(curl -s -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Premium Indicator", "description": "Advanced trading indicator", "price": 2999}')

echo "$response" | jq .
id=$(echo "$response" | jq -r '.id')

# Test getting product
echo -e "\nTesting get product:"
curl -s http://localhost:3000/api/products/$id | jq .

# Test updating product
echo -e "\nTesting product update:"
curl -s -X PUT http://localhost:3000/api/products/$id \
  -H "Content-Type: application/json" \
  -d '{"name": "Premium Trading Indicator V2"}' | jq .

# Test search
echo -e "\nTesting search:"
curl -s http://localhost:3000/api/search?q=trading | jq .

# Test deletion (only if in DRAFT state)
echo -e "\nTesting deletion:"
curl -s -X DELETE http://localhost:3000/api/products/$id | jq .
