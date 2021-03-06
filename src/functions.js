import moment from "moment";
import Cookie from "js-cookie";

export const stringToDate = dateString => {
  if (dateString === undefined) {
    return null;
  }
  const regex = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;
  const dateArray = regex.exec(dateString);
  if (!dateArray) return null;

  const dateObject = new Date(
    +dateArray[1],
    +dateArray[2] - 1,
    +dateArray[3],
    +dateArray[4],
    +dateArray[5],
    +dateArray[6]
  );
  return dateObject;
};

export const dateDisplay = (date, format = "Y年MM月DD日 HH:mm") => {
  return moment(date, "YYYY-MM-DDTHH:mm:ss").format(format);
};

export const expireUpdate = res => {
  if (res.auth.status === true) {
    Cookie.set("uid", Cookie.get("uid"), {
      expires: stringToDate(res.auth.expire),
      secure: true
    });
  } else {
    Cookie.remove("uid");
  }
};
