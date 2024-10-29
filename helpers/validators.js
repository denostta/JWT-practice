const JOI = require("@hapi/joi");

const userSchema = JOI.object({
  email: JOI.string().email().lowercase().required(),
  password: JOI.string().min(3).required(),
});

module.exports = {
  userSchema,
};
