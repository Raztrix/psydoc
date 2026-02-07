package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"server/dto"
	"server/service"

	"github.com/go-chi/chi/v5"
)

type FileHandler struct {
	Service service.FileService
}

func NewFileHandler(s service.FileService) *FileHandler {
	return &FileHandler{Service: s}
}

// 3. Helper: WriteJSON (Avoids repeating code)
func (h *FileHandler) WriteJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

// 4. Upload File (With DTOs)
func (h *FileHandler) UploadFile(w http.ResponseWriter, r *http.Request) {
	// Parse max 50MB
	if err := r.ParseMultipartForm(50 << 20); err != nil {
		h.WriteJSON(w, http.StatusBadRequest, dto.CreateError("File too big or bad format", "UPLOAD_ERR"))
		return
	}

	file, header, err := r.FormFile("document")
	if err != nil {
		h.WriteJSON(w, http.StatusBadRequest, dto.CreateError("Invalid file", "FILE_MISSING"))
		return
	}
	defer file.Close()

	description := r.FormValue("description")

	savedFile, err := h.Service.SaveFile(file, header, description)
	if err != nil {
		h.WriteJSON(w, http.StatusInternalServerError, dto.CreateError(err.Error(), "SAVE_FAILED"))
		return
	}
	
	fileDto := dto.FileResponse{
		ID:         savedFile.Id,
		FileName:   savedFile.OriginalName,
		SizeMB:     float64(savedFile.SizeBytes) / 1024 / 1024,
		UploadedAt: savedFile.CreatedAt,
	}

	// Respond with Success
	h.WriteJSON(w, http.StatusCreated, dto.CreateSuccess(fileDto, "File uploaded successfully"))
}

// 5. Download File
func (h *FileHandler) DownloadFile(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	file, path, err := h.Service.GetFile(id)
	if err != nil {
		http.Error(w, "File not found", http.StatusNotFound)
		return
	}

	// Force download
	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", file.OriginalName))
	w.Header().Set("Content-Type", "application/octet-stream")
	http.ServeFile(w, r, path)
}

// 6. Get All Files (Optional, for listing)
func (h *FileHandler) GetFiles(w http.ResponseWriter, r *http.Request) {
	files, err := h.Service.ListFiles()
	if err != nil {
		h.WriteJSON(w, http.StatusInternalServerError, dto.CreateError("Failed to fetch files", "DB_ERR"))
		return
	}

	// Map list to DTOs
	var fileDtos []dto.FileResponse
	for _, f := range files {
		fileDtos = append(fileDtos, dto.FileResponse{
			ID:         f.Id,
			FileName:   f.OriginalName,
			SizeMB:     float64(f.SizeBytes) / 1024 / 1024,
			UploadedAt: f.CreatedAt,
		})
	}

	h.WriteJSON(w, http.StatusOK, dto.CreateSuccess(fileDtos, "Files retrieved"))
}
