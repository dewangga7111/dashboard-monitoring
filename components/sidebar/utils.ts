// recursive check if item or children is active
export const isMenuActive = (item: any, pathname: string): boolean => {
  if (pathname.includes(item.path)) return true;
  if (item.children) {
    return item.children.some((child: any) => {
      return isMenuActive(child, pathname)
    });
  }
  return false;
};
