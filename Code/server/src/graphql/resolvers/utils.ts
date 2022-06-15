export function calculateSkip(page: number, limit: number) {
  /* This shows the total documents on each page*/
  return page > 0 ? (page - 1) * limit : 0
  //page =1; limit =10; cursor starts at 0
  //page =2; limit =10; cursor starts at 10
}
