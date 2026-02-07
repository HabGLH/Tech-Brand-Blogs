export const canEditePost = (
  userRole: number,
  authorId: string,
  userId: string,
): boolean => {
  return userRole === 777 ? true : userRole === 555 && authorId === userId;
};

export const canDeletePost = (
  userRole: number,
  postAuthorId: string,
  userId: string,
): boolean => {
  return userRole === 777 ? true : userRole === 555 && postAuthorId === userId;
};

export const canCreatePost = (userRole: number): boolean => {
  return userRole === 777 || userRole === 555; // Both admin and regular users can create posts
};

export const canEditCategory = (userRole: number): boolean => {
  return userRole === 777; // Only admin can edit categories
};

export const canDeleteCategory = (userRole: number): boolean => {
  return userRole === 777; // Only admin can delete categories
};

export const canCreateCategory = (userRole: number): boolean => {
  return userRole === 777; // Only admin can create categories
};

export const canEditUser = (
  userRole: number,
  targetUserId: string,
  userId: string,
): boolean => {
  return userRole === 777 ? true : userRole === 555 && targetUserId === userId;
};

export const canDeleteUser = (
  userRole: number,
  targetUserId: string,
  userId: string,
): boolean => {
  return userRole === 777 ? true : userRole === 555 && targetUserId === userId;
};

export const canCreateUser = (userRole: number): boolean => {
  return userRole === 777; // Only admin can create users
};

export const canViewUser = (userRole: number): boolean => {
  return userRole === 777 || userRole === 555; // Both admin and regular users can view user profiles
};
