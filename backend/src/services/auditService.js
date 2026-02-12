const { AuditLog } = require("../models/AuditLog");

const createAuditLog = async ({
  requestId,
  action,
  fromStatus,
  toStatus,
  performedBy,
}) => {
  await AuditLog.create({
    request: requestId,
    action,
    fromStatus,
    toStatus,
    performedBy,
  });
};

module.exports = {
  createAuditLog,
};
