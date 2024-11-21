export const capitalizeFirstLetter = (val) => {
  if (!val) return "";
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`;
};

/**
 * Phía FE sẽ tự tạo ra 1 cái card đặc biệt: Placeholder Card không liên quan tới Back-end
 * Card đặc biệt này sẽ được ẩn ở gian diện UI người dùng
 * Cấu trúc Id của Card này để unique
 * "columnId-placeholder-card"
 */
export const generatePlaceholderCard = (column) => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCard: true,
  };
};
