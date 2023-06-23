const Attributes = {
  statusEnums: ["pending", "complete", "canceled"],
  ownerEnums: ["none", "owner 1", "owner 2", "owner 3", "owner 4"],
  visaEnums: ["none", "visa 1", "visa 2", "visa 3"],
};

const roles = {
  admin: {
    permissions: ["create", "read", "update", "delete"],
  },
  user: {
    permissions: ["read", "update"],
  },
};

module.exports = Attributes;
