const createJwtPayload = (user) => {
    if (!user || !user._id || !user.email || !user.role || !user.name) {
        throw new Error('Thông tin người dùng không hợp lệ để tạo payload');
    }

    return {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
    };
};

module.exports = createJwtPayload;
