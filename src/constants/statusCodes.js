const StatusCodes = Object.freeze({
    // 2xx Success
    OK: 200,                      // Thành công
    CREATED: 201,                 // Tạo thành công
    ACCEPTED: 202,                // Chấp nhận request nhưng chưa xử lý xong
    NO_CONTENT: 204,              // Thành công nhưng không có nội dung trả về

    // 4xx Client Errors
    BAD_REQUEST: 400,             // Request sai (thiếu dữ liệu, sai cú pháp)
    UNAUTHORIZED: 401,            // Chưa đăng nhập hoặc token không hợp lệ
    FORBIDDEN: 403,               // Không có quyền truy cập
    NOT_FOUND: 404,               // Không tìm thấy tài nguyên

    CONFLICT: 409,                // Dữ liệu xung đột (ví dụ: email đã tồn tại)
    UNPROCESSABLE_ENTITY: 422,    // Request đúng cú pháp nhưng sai logic (ví dụ: validation lỗi)

    // 5xx Server Errors
    INTERNAL_SERVER_ERROR: 500,   // Lỗi server
    SERVICE_UNAVAILABLE: 503,     // Server quá tải hoặc bảo trì
});

module.exports = StatusCodes;
