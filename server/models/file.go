package models

import "time"

type File struct {
	// File_id is the primary key in the database

	Id int `json:"id"`

	// Filename is the unique, random name saved on the disk (e.g., "173824_report.pdf")
	// We use this to find the physical file.
	FileName string `json:"fileName"`

	// OriginalName is what the user uploaded (e.g., "Patient_Cohen_History.pdf")
	// We use this when the user clicks "Download".
	OriginalName string `json:"originalName"`

	// Description is optional text describing the file
	Description string `json:"description"`

	// SizeBytes helps the frontend show "5.2 MB" before downloading
	SizeBytes int64 `json:"sizeBytes"`

	// CreatedAt is when the file was uploaded
	CreatedAt time.Time `json:"createdAt"`
}
