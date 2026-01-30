package service

import (
	"errors"
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"server/models"
	"server/repository"
	"time"
)

// FileService defines the logic our Handlers can use
type FileService interface {
	SaveFile(file multipart.File, header *multipart.FileHeader, description string) (*models.File, error)
	GetFile(id int) (*models.File, string, error)
	ListFiles() ([]models.File, error)
}

// fileService is the implementation
type fileService struct {
	Repo       repository.FileRepository
	UploadPath string
}

// NewFileService creates the service with the repository and upload folder path
func NewFileService(repo repository.FileRepository) FileService {
	// We default to "uploads" folder inside server
	return &fileService{
		Repo:       repo,
		UploadPath: "uploads",
	}
}

// SaveFile handles physical storage + DB record
func (s *fileService) SaveFile(file multipart.File, header *multipart.FileHeader, description string) (*models.File, error) {
	// 1. Validation
	if header.Size > 50*1024*1024 { // 50MB limit
		return nil, errors.New("file is too large (limit 50MB)")
	}

	// 2. Create Unique Filename
	// We prepend the current timestamp to the name (e.g., "17382411_Report.pdf")
	uniqueName := fmt.Sprintf("%d_%s", time.Now().Unix(), header.Filename)

	// Create the full path: "server/uploads/17382411_Report.pdf"
	fullPath := filepath.Join(s.UploadPath, uniqueName)

	// 3. Save Physical File to Disk
	dst, err := os.Create(fullPath)
	if err != nil {
		return nil, fmt.Errorf("failed to create file on disk: %v", err)
	}
	defer dst.Close()

	// Copy bytes from upload stream to disk file
	if _, err := io.Copy(dst, file); err != nil {
		return nil, fmt.Errorf("failed to save file content: %v", err)
	}

	// 4. Create Model
	fileModel := &models.File{
		FileName:     uniqueName,      // The system name (on disk)
		OriginalName: header.Filename, // The pretty name (for user)
		Description:  description,
		SizeBytes:    header.Size,
		CreatedAt:    time.Now(),
	}

	// 5. Save Metadata to Database
	id, err := s.Repo.Create(fileModel)
	if err != nil {
		// Cleanup: If DB fails, delete the physical file so we don't have "ghost" files
		os.Remove(fullPath)
		return nil, err
	}
	fileModel.FileID = id

	return fileModel, nil
}

// GetFile retrieves metadata and the physical path for downloading
func (s *fileService) GetFile(id int) (*models.File, string, error) {
	// 1. Get Info from DB
	file, err := s.Repo.GetByID(id)
	if err != nil {
		return nil, "", err
	}

	// 2. Construct Path
	fullPath := filepath.Join(s.UploadPath, file.FileName)

	// 3. Verify file exists
	if _, err := os.Stat(fullPath); os.IsNotExist(err) {
		return nil, "", errors.New("file missing from disk")
	}

	return file, fullPath, nil
}

// ListFiles returns all files
func (s *fileService) ListFiles() ([]models.File, error) {
	return s.Repo.GetAll()
}
