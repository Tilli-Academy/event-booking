require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");
const Service = require("./models/Service");

const services = [
  { name: "Birthday Event", description: "Complete birthday party planning with decorations, cake, and entertainment.", price: 15000 },
  { name: "Marriage Event", description: "Full wedding event management including venue, catering, and photography.", price: 150000 },
  { name: "Pre-Wedding Shoot", description: "Professional pre-wedding photography at scenic locations.", price: 25000 },
  { name: "Post-Wedding Shoot", description: "Cinematic post-wedding photo and video sessions.", price: 20000 },
  { name: "Casual Party", description: "Casual get-together and house party arrangements.", price: 10000 },
  { name: "Child 1st Birthday", description: "Themed first birthday party with balloon decor and entertainment.", price: 20000 },
  { name: "Engagement Event", description: "Ring ceremony and engagement party planning.", price: 50000 },
];

const seed = async () => {
  await connectDB();

  // Clear existing data
  await User.deleteMany({});
  await Service.deleteMany({});

  // Create admin user
  const admin = await User.create({
    name: "Admin",
    email: "admin@eventbooking.com",
    password: "admin123",
    role: "admin",
  });
  console.log(`Admin created: ${admin.email} / admin123`);

  // Create demo user
  const user = await User.create({
    name: "Demo User",
    email: "user@eventbooking.com",
    password: "user123",
    role: "user",
  });
  console.log(`User created: ${user.email} / user123`);

  // Create services
  const created = await Service.insertMany(services);
  console.log(`${created.length} services seeded`);

  await mongoose.connection.close();
  console.log("Seed complete. Connection closed.");
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
