const User = require("../models/user");
User.countDocuments().then(async (userCount) => {
  if (userCount == 0) {
    const userToInsert = {
      firstName: "Admin",
      lastName: "Admin",
      email: "admin@gmail.com",
      password: "$2a$10$MDIRedaQqMwEzx78OdnOR.8ve5/W42.qDXm/GgQYkTsYfeioKmBkG",
      role: "admin",
      phone: 12345678,
      adress: "Monastir",
    };
    await User.create(userToInsert);
  }
});
