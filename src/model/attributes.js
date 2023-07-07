exports.statusEnums = ["pending", "complete", "canceled"];
exports.ownerEnums = ["none", "owner 1", "owner 2", "owner 3", "owner 4"];
exports.visaEnums = ["none", "visa 1", "visa 2", "visa 3"];
exports.urlRegex = /^https?:\/\/\S+\.\S+$/;
exports.phoneRegex = /^(\+|\d)[0-9]{1,14}$/;
exports.emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
