exports.statusEnums = ["pending", "complete", "canceled"];
exports.ownerEnums = ["none", "owner 1", "owner 2", "owner 3", "owner 4"];
exports.visaEnums = [
  "none",
  "EMPLOYMENT_D_CAIRO",
  "FAMILY_CHILDREN_CAIRO",
  "FAMILY_PARENTS_CAIRO",
  "FAMILY_SPOUSE_CAIRO",
  "MISSION_CAIRO",
  "RELIGIOUS_CAIRO",
  "RE_ENTRY_CAIRO",
  "STUDY_D_CAIRO",
  "TIROCINIO_CAIRO",
  "EMPLOYMENT_D_ALEX",
  "FAMILY_CHILDREN_ALEX",
  "FAMILY_PARENTS_ALEX",
  "FAMILY_SPOUSE_ALEX",
  "MISSION_ALEX",
  "MISSION_GRATIS_ALEX",
  "RELIGIOUS_ALEX",
  "RE_ENTRY_ALEX",
  "STUDY_D_ALEX",
  "TIROCINIO_ALEX",
];
exports.urlRegex = /^https?:\/\/\S+\.\S+$/;
exports.phoneRegex = /^(\+|\d)[0-9]{1,14}$/;
exports.emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
