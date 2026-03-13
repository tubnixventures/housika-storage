# Housika Storage API

A high-performance, secure, and scalable file storage API built with Hono and Cloudflare R2.

## Features

- JWT-based authentication
- File upload, deletion, and presigned URL generation
- Support for all file types
- CORS enabled
- Security headers
- Logger middleware

## Environment Variables

Set the following environment variables:

- `JWT_SECRET`: Secret key for JWT verification
- `R2_ENDPOINT`: Cloudflare R2 endpoint
- `R2_ACCESS_KEY_ID`: R2 access key ID
- `R2_SECRET_ACCESS_KEY`: R2 secret access key
- `PORT`: Server port (optional, defaults to 3000)

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production

```bash
npm run build
npm start
```

## API Endpoints

### Upload File

`POST /upload?bucket=<bucket>&key=<key>`

Body: File content

*No authentication required (for internal backend calls)*

### Delete File

`DELETE /delete?bucket=<bucket>&key=<key>`

Or mass delete: `DELETE /delete?bucket=<bucket>` with JSON body `["url1", "url2"]`

*Requires `Authorization: Bearer <jwt_token>` header*

### Generate Presigned URL

`GET /presign?bucket=<bucket>&key=<key>&expiresIn=<seconds>`

Or mass: `POST /presign` with JSON body `{bucket, keys, expiresIn}`

*Requires `Authorization: Bearer <jwt_token>` header*

### Health Check

`GET /`
