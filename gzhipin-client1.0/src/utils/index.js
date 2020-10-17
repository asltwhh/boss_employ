/* 
用户主界面
    大神：/dashen
    老板 /laoban
用户的信息完善界面
    大神 /dasheninfo
    老板 /laobaninfo

确定是否要跳转到信息完善界面：
    首先判断用户类型：看user.type
        确定是大神还是老板
    判断是否已经完善信息：就是看user.header是否有值    header:'头像3'
        已经完善过信息的：header是有值的
        没有完善过信息的：header是空串

*/

// 返回对应的路由路径
export function getRedirectTo(type, header) {
  let path = "";
  // type
  if (type === "laoban") {
    path = "/laoban";
  } else {
    path = "/dashen";
  }
  // header
  if (!header) {
    // header为空，则需要完善信息，返回信息完善界面
    path += "info";
  }
  return path;
}
