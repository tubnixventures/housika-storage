# Housika Storage API

A high-performance, secure, and scalable file storage API built with Hono and Cloudflare R2.

## Features

- JWT-based authentication (header or cookie)
- File upload, deletion, and presigned URL generation
- Support for all file types
- CORS enabled
- Security headers
- Rate limiting (100 req/min per IP)
- Logger middleware
- PM2 clustering support for hyperscale performance

## Authentication

The API supports hybrid token authentication:

- **Header**: `Authorization: Bearer <jwt_token>`
- **Cookie**: `token=<jwt_token>`

Web applications can use cookies for automatic token handling, while mobile apps can use headers.

## Environment Variables

Set the following environment variables:

- `JWT_SECRET`: Secret key for JWT verification
- `R2_ENDPOINT`: Cloudflare R2 endpoint
- `R2_ACCESS_KEY_ID`: R2 access key ID
- `R2_SECRET_ACCESS_KEY`: R2 secret access key
- `REDIS_URL`: Redis connection URL (default: redis://localhost:6379)
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

## PM2 Clustering (Hyperscale)

For high-performance deployment with multiple CPU cores:

```bash
npm run pm2:cluster  # Start with max CPU cores
npm run pm2          # Start single instance
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
