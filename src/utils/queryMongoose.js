const aqp = require('api-query-params');
const mongoose = require('mongoose');


const paginate = async (model, queryParams, populate = '') =>{
    const current = parseInt(queryParams.current) || 1;
    const pageSize = parseInt(queryParams.pageSize) || 10;
    const skip = (current - 1) * pageSize;

    const cleanQuery = { ...queryParams };
    delete cleanQuery.current;
    delete cleanQuery.pageSize;

    const { filter, sort } = aqp(cleanQuery);

    const mongoFilter = { isDeleted: false, ...filter };
    for (const key in mongoFilter) {
        if (typeof mongoFilter[key] === 'string') {
            mongoFilter[key] = { $regex: mongoFilter[key], $options: 'i' };
        }
    }

    const [data, total] = await Promise.all([
        model.find(mongoFilter).sort(sort).skip(skip).limit(pageSize).populate(populate),
        model.countDocuments(mongoFilter),
    ]);

    return {
        meta: {
            current,
            pageSize,
            total,
            pages: Math.ceil(total / pageSize),
        },
        data,
    };
}

const softDeleteDocument = async(model, id, currentUser = {}, options = {}) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid document ID');
    }

    const document = await model.findById(id);

    if (!document) {
        throw new Error('Document not found');
    }

    if (options.protectEmail && document.email === options.protectEmail) {
        throw new Error(`Xóa tài khoản VIP ${options.protectEmail} lấy gì mà test`);
    }

    if (
        options.protectRole &&
        document.role?.name &&
        document.role.name.toUpperCase() === options.protectRole.toUpperCase()
    ) {
        throw new Error(`Không thể xóa tài khoản có quyền ${options.protectRole}`);
    }

    document.isDeleted = true;
    document.deletedAt = new Date();
    document.deletedBy = {
        _id: currentUser._id || null,
        email: currentUser.email || null,
    };

    await document.save();
    return { deleted: document._id };
}



module.exports = {paginate, softDeleteDocument};