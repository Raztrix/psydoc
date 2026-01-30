package dto

// 1. Base Response (Common fields for everyone)
// This is like your abstract base class in C#
type BaseResponse struct {
	Success   bool   `json:"success"`
	Message   string `json:"message"`
	ErrorCode string `json:"error_code,omitempty"` // Nullable in JSON
}

// 2. Generic Data Response (The "Inheritance")
// We embed BaseResponse to "inherit" its fields.
// [T any] is exactly like <T> in C#.
type Response[T any] struct {
	BaseResponse   // <--- Composition (Inheritance) happens here
	Data         T `json:"data"`
}

// 3. Factory Methods (Like C# Static Constructors)
// These make your controller code clean: dtos.Success(data)

func CreateSuccess[T any](data T, message string) Response[T] {
	return Response[T]{
		BaseResponse: BaseResponse{
			Success: true,
			Message: message,
		},
		Data: data,
	}
}

func CreateError(message string, code string) BaseResponse {
	return BaseResponse{
		Success:   false,
		Message:   message,
		ErrorCode: code,
	}
}
