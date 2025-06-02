const rolesSchema = require('../schema/roles.schema');

const checkPermission = async (req, res, next) => {
  try {
    const user = req.user;
    console.log('User lấy từ req:', user);

    if (!user?.role?._id) {
      console.log('User không có role hoặc role._id');
      return res.status(403).json({ message: 'Không có quyền truy cập (không có vai trò).' });
    }

    const role = await rolesSchema.findById(user.role._id).populate('permissions');
    console.log('Role tìm được:', role);

    if (!role || role.permissions.length === 0) {
      console.log('Role không tồn tại hoặc không có permissions');
      return res.status(403).json({ message: 'Vai trò không có quyền nào.' });
    }

    const method = req.method;
    const path = req.originalUrl.split('?')[0]; 
    console.log('Phương thức HTTP:', method);
    console.log('Đường dẫn request:', path);

    const hasPermission = role.permissions.some(p => {
      console.log(`Kiểm tra permission: method=${p.method}, path=${p.path}`);
      return p.method === method && path.startsWith(p.path);
    });

    console.log('Kết quả kiểm tra quyền:', hasPermission);

    if (!hasPermission) {
      console.log('Không có quyền truy cập tài nguyên này');
      return res.status(403).json({ message: 'Bạn không có quyền truy cập tài nguyên này.' });
    }

    console.log('Có quyền truy cập, tiếp tục...');
    next();
  } catch (error) {
    console.error('Lỗi kiểm tra quyền:', error);
    return res.status(500).json({ message: 'Lỗi kiểm tra quyền truy cập.' });
  }
};

module.exports = checkPermission;
