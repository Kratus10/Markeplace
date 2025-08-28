# Upload Pipeline Documentation

This document outlines the design and implementation of the secure upload pipeline.

## High-Level Flow

1.  **Client requests presigned URL(s):** The client sends a POST request to `/api/uploads/presign` with file metadata. The server validates the request, creates an `UploadIntent` record in the database, and returns a presigned URL for direct upload to cloud storage (R2/S3).

2.  **Client uploads file:** The client uploads the file directly to the cloud storage provider using the presigned URL.

3.  **Client notifies server:** Upon successful upload, the client sends a POST request to `/api/uploads/complete`.

4.  **Server-side validation and scanning:** The `complete` handler verifies the upload, performs a quick MIME type sniff, and enqueues a background job for more intensive scanning.

5.  **Scan worker:** A background worker (`workers/scan-worker`) processes the uploaded file. This includes:
    *   Verifying the file's magic bytes.
    *   Running anti-virus scans (e.g., via VirusTotal).
    *   For archives, performing sandboxed extraction with zip bomb protection.
    *   For executables or scripts, running static code analysis.

6.  **Quarantine and approval:** Based on the scan results, the file is either marked as `APPROVED` or `QUARANTINED`. Quarantined files can be reviewed by an administrator in the admin UI.

## API Endpoints

*   `POST /api/uploads/presign`: Get a presigned URL for uploading a file.
*   `POST /api/uploads/complete`: Confirm that a file has been uploaded.
*   `POST /api/uploads/cancel`: Cancel an upload and clean up resources.

## Database Models

*   `UploadIntent`: Represents a request to upload a file.
*   `Upload`: Represents a file that has been successfully uploaded and is undergoing or has completed the scanning process.

## Security Considerations

*   **Server-side MIME sniffing:** Always verify file types on the server to prevent spoofing.
*   **Sandboxed scanning:** All intensive scanning operations are performed in an isolated worker process.
*   **Zip bomb prevention:** The scan worker includes protections against malicious archives.
*   **Rate limiting:** API endpoints are rate-limited to prevent abuse.
