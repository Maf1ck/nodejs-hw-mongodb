# API Test Examples

## Testing the Contacts API

### 1. Create a Contact (POST /contacts)

```bash
curl -X POST http://localhost:3000/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phoneNumber": "1234567890",
    "email": "john@example.com",
    "contactType": "personal",
    "isFavourite": false
  }'
```

### 2. Get All Contacts with Pagination (GET /contacts)

```bash
# Basic pagination
curl "http://localhost:3000/contacts?page=1&perPage=5"

# With sorting
curl "http://localhost:3000/contacts?sortBy=name&sortOrder=desc"

# With filtering
curl "http://localhost:3000/contacts?type=personal&isFavourite=true"

# Combined pagination, sorting, and filtering
curl "http://localhost:3000/contacts?page=1&perPage=3&sortBy=name&sortOrder=asc&type=work"
```

### 3. Get Contact by ID (GET /contacts/:contactId)

```bash
curl http://localhost:3000/contacts/[contact-id]
```

### 4. Update Contact (PATCH /contacts/:contactId)

```bash
curl -X PATCH http://localhost:3000/contacts/[contact-id] \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated",
    "isFavourite": true
  }'
```

### 5. Delete Contact (DELETE /contacts/:contactId)

```bash
curl -X DELETE http://localhost:3000/contacts/[contact-id]
```

## Validation Examples

### Invalid Contact Creation (will return 400)

```bash
# Missing required fields
curl -X POST http://localhost:3000/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jo"
  }'

# Invalid email format
curl -X POST http://localhost:3000/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phoneNumber": "1234567890",
    "email": "invalid-email",
    "contactType": "personal"
  }'

# Invalid contact type
curl -X POST http://localhost:3000/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phoneNumber": "1234567890",
    "contactType": "invalid"
  }'
```

### Invalid ID (will return 400)

```bash
curl http://localhost:3000/contacts/invalid-id
```

## Expected Response Examples

### Successful GET /contacts Response

```json
{
  "status": 200,
  "message": "Successfully found contacts!",
  "data": {
    "data": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "phoneNumber": "1234567890",
        "email": "john@example.com",
        "contactType": "personal",
        "isFavourite": false,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "page": 1,
    "perPage": 10,
    "totalItems": 1,
    "totalPages": 1,
    "hasPreviousPage": false,
    "hasNextPage": false
  }
}
```

### Validation Error Response

```json
{
  "status": 400,
  "message": "Name must be at least 3 characters long, Phone number is required"
}
``` 