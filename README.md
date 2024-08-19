# Recruitment Backend
Đây là phần backend của dự án website đăng tin tuyển dụng, cung cấp API cho frontend để quản lý dữ liệu về tin tuyển dụng, người dùng và các chức năng liên quan.

## Tính năng chính:
* **Quản lý tin tuyển dụng:** 
    * 📝 Tạo tin tuyển dụng mới
    * ✏️ Cập nhật thông tin tin tuyển dụng
    * 🗑️ Xóa tin tuyển dụng
    * 🔍 Tìm kiếm tin tuyển dụng theo tiêu chí
    * 📊 Lọc tin tuyển dụng theo danh mục, vị trí, mức lương, ...
    * 📑 Hiển thị danh sách tin tuyển dụng
    * 📄 Hiển thị chi tiết thông tin tin tuyển dụng
* **Quản lý người dùng:**
    * 👤 Đăng ký tài khoản người dùng
    * 🔑 Đăng nhập tài khoản người dùng
    * ⚙️ Cập nhật thông tin người dùng
    * ❌ Xóa tài khoản người dùng
    * 🔐 Quản lý quyền truy cập của người dùng
* **Quản lý danh mục:**
    * ➕ Tạo danh mục công việc mới
    * ✏️ Cập nhật thông tin danh mục
    * 🗑️ Xóa danh mục
    * 📑 Hiển thị danh sách danh mục
* **Quản lý ứng viên:**
    * 📨 Ứng viên nộp đơn ứng tuyển
    * 📂 Quản lý hồ sơ ứng viên
    * ⏳ Theo dõi trạng thái ứng tuyển
* **Quản lý nhà tuyển dụng:**
    * 🏢 Tạo tài khoản nhà tuyển dụng
    * ⚙️ Quản lý thông tin nhà tuyển dụng
    * 💼 Quản lý tin tuyển dụng của nhà tuyển dụng
* **Xử lý email:**
    * Tự động gửi mail cho người dùng khi người dùng quan tâm đến các keyword
    * 📧 Gửi email thông báo cho người dùng (Chờ cập nhật)
    * 📧 Gửi email xác nhận tài khoản (Chờ cập nhật)
    * 📧 Gửi email thông báo ứng tuyển (Chờ cập nhật)

## Công nghệ:
 * <strong>Framework:</strong> NestJS
 * <strong>Database:</strong>: MongoDB
 * <strong>Security:</strong>: JWT, Helmet, CORS

## Cài đặt:
1. **Cài đặt Node.js:**
    Tải xuống và cài đặt Node.js từ trang web chính thức: [https://nodejs.org/](https://nodejs.org/)
2. **Cài đặt MongoDB:**
    Tải xuống và cài đặt MongoDB từ trang web chính thức: [https://www.mongodb.com/](https://www.mongodb.com/)
3. **Clone repository:**
    Clone repository dự án về máy:
    ```bash
    git clone https://github.com/GYEzra/nestjs_recruitment
    ```
4. **Cài đặt dependency:**
    Vào thư mục dự án và cài đặt các dependency:
    ```bash
    npm install
    ```
5. **Cấu hình môi trường:**
    Tạo file `.env` và thêm các biến môi trường cần thiết:
    ```
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/recruitment
    JWT_ACCESS_TOKEN_SECRET=your_secret_key
    JWT_ACCESS_EXPIRE=3600
    JWT_REFRESH_TOKEN_SECRET=your_secret_key
    JWT_REFRESH_EXPIRE=86400
    USERNAME_ADMIN=admin
    PASSWORD=password
    HAS_INIT=false
    EMAIL_HOST=smtp.gmail.com
    EMAIL_AUTH_USERNAME=your_email@gmail.com
    EMAIL_AUTH_PASSWORD=your_password
    EMAIL_PREVIEW=false
    ```
6. **Khởi động server:**
    Chạy câu lệnh phía dưới và tận hưởng:
    ```bash
    npm run start
    ```