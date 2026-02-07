package dto

import "time"

// UploadRequest represents the incoming JSON body (if you had one)
type UploadFileRequest struct {
	Description string `json:"description"`
}

// FileResponse is the clean DTO we send back to React
// It inherits nothing, but it WILL be wrapped by Response[T]
type FileResponse struct {
	ID          int       `json:"id"`
	FileName    string    `json:"fileName"` // Pretty name
	SizeMB      float64   `json:"sizeMB"`   // Calculated field
	UploadedAt  time.Time `json:"uploadedAt"`
	Description string    `json:"description"`
}
