'use strict';

const getPagination = (currentRoute, reqParams, limit, totalBlogs) => {
    const pageNumber = Number(reqParams.pageNumber) || 1;
    const skip = limit * (pageNumber - 1);

    const paginationObj = {
        next: totalBlogs > (pageNumber * limit) ? `${currentRoute}page/${pageNumber + 1}` : null,
        prev: skip ? `${currentRoute}/page/${pageNumber - 1}` : null,
        total_page: Math.ceil(totalBlogs / limit),
        current_page: pageNumber,
        skip,
        limit
    };

    return paginationObj;
}
module.exports = getPagination