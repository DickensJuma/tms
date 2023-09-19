const Owner = require("../models/Owner");

exports.seedSuperAdmin = async () => {
    const email = "dickensjuma13@gmail.com"
    const password = "password123"
    const role = "superadmin"
    const ownerExists = await Owner.findOne({ email });
    if (ownerExists) return;

    const newowner = new Owner({
        email,
        password,
        role,
        name: 'SuperAdmin',
        citizenshipNumber: '123',
        phone: 704868023,
        isVerified: true
    });

    await newowner.save();
    console.warn("Superadmin seeded successfully...")
  };