const { match } = require('path-to-regexp');
const rolesSchema = require('../schema/roles.schema');

const checkPermission = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user?.role?._id) {
      return res.status(403).json({ message: 'Không có quyền truy cập (không có vai trò).' });
    }

    const role = await rolesSchema.findById(user.role._id).populate('permissions');

    if (!role || role.permissions.length === 0) {
      return res.status(403).json({ message: 'Vai trò không có quyền nào.' });
    }

    const method = req.method;
    const path = req.originalUrl.split('?')[0];

    const hasPermission = role.permissions.some(p => {
      if (p.method !== method) return false;
      const matcher = match(p.path, { decode: decodeURIComponent });
      return matcher(path) !== false;
    });

    if (!hasPermission) {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập tài nguyên này.' });
    }

    next();
  } catch (error) {
    console.error('Lỗi kiểm tra quyền:', error);
    return res.status(500).json({ message: 'Lỗi kiểm tra quyền truy cập.' });
  }
};

module.exports = checkPermission;
