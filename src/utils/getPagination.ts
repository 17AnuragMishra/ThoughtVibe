export interface Pagination {
  next: string | null;
  prev: string | null;
  totalPage: number;
  currentPage: number;
  limit: number;
  skip: number;
}

export function getPagination(
  currentRoute: string,
  reqParams: { pageNumber?: string | number },
  limit: number,
  totalBlogs: number
): Pagination {
  const pageNumber = Number(reqParams.pageNumber) || 1;
  const skip = limit * (pageNumber - 1);
  const totalPage = Math.ceil(totalBlogs / limit);
  const currentPage = pageNumber;

  return {
    next:
      totalBlogs > pageNumber * limit
        ? `${currentRoute}page/${pageNumber + 1}`
        : null,
    prev:
      skip && currentPage <= totalPage
        ? `${currentRoute}page/${pageNumber - 1}`
        : null,
    totalPage,
    currentPage,
    limit,
    skip,
  };
} 