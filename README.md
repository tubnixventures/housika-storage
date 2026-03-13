# Housika Storage API

A high-performance, secure, and scalable file storage API built with Hono and Cloudflare R2.

## Features

- JWT-based authentication
- File upload, deletion, and presigned URL generation
- Support for all file types
- CORS enabled
- Security headers
- Logger middleware

## Authentication

The API supports hybrid token authentication:

- **Header**: `Authorization: Bearer <jwt_token>`
- **Cookie**: `token=<jwt_token>`

Web applications can use cookies for automatic token handling, while mobile apps can use headers.

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
