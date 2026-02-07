package repository

import (
	"database/sql"
	"server/models"
)

// 1. The Interface (Contract)
// The Service layer only talks to this. It doesn't know about SQL.
type FileRepository interface {
	Create(file *models.File) (int, error)
	GetByID(id int) (*models.File, error) // Added this for download
	GetAll() ([]models.File, error)
}

// 2. The Implementation (Struct)
// This holds the actual database connection.
type sqlFileRepo struct {
	DB *sql.DB
}

// 3. The Constructor
// This creates the struct but returns the Interface.
func NewFileRepo(db *sql.DB) FileRepository {
	return &sqlFileRepo{DB: db}
}

// 4. The Methods (SQL Logic)
func (r *sqlFileRepo) Create(file *models.File) (int, error) {
	res, err := r.DB.Exec("INSERT INTO files (fileName, originalName, description, sizeBytes) VALUES (?, ?, ?, ?)",
		file.FileName, file.OriginalName, file.Description, file.SizeBytes)
	if err != nil {
		return 0, err
	}
	id, _ := res.LastInsertId()
	return int(id), nil
}

func (r *sqlFileRepo) GetByID(id int) (*models.File, error) {
	row := r.DB.QueryRow("SELECT id, fileName, originalName, description, sizeBytes, createdAt FROM files WHERE id = ?", id)

	var f models.File
	if err := row.Scan(&f.Id, &f.FileName, &f.OriginalName, &f.Description, &f.SizeBytes, &f.CreatedAt); err != nil {
		return nil, err
	}
	return &f, nil
}

func (r *sqlFileRepo) GetAll() ([]models.File, error) {
	rows, err := r.DB.Query("SELECT id, fileName, originalName, description, sizeBytes, createdAt FROM files")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var files []models.File
	for rows.Next() {
		var f models.File
		if err := rows.Scan(&f.Id, &f.FileName, &f.OriginalName, &f.Description, &f.SizeBytes, &f.CreatedAt); err != nil {
			continue
		}
		files = append(files, f)
	}
	return files, nil
}
