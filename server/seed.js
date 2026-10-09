require("dotenv").config();
const db = require("./config/db"),
  Template = require("./models/CropTemplate"),
  User = require("./models/User"),
  bcrypt = require("bcryptjs");
const schedules = {
  Wheat: [
    ["Land Preparation", 0, "Land Preparation"],
    ["Soil Preparation", 2, "Land Preparation"],
    ["Seed Treatment", 5, "Sowing"],
    ["Sowing", 7, "Sowing"],
    ["First Irrigation", 20, "Irrigation"],
    ["Fertilizer Application", 35, "Fertilization"],
    ["Weed Management", 45, "Weed Management"],
    ["Pest Monitoring", 60, "Pest Management"],
    ["Growth Monitoring", 90, "Growth Monitoring"],
    ["Harvest Preparation", 120, "Harvesting"],
    ["Harvesting", 130, "Harvesting"],
  ],
  Rice: [
    ["Land Preparation", 0, "Land Preparation"],
    ["Seed Treatment", 5, "Sowing"],
    ["Transplantation", 20, "Sowing"],
    ["First Irrigation", 25, "Irrigation"],
    ["Fertilizer Application", 35, "Fertilization"],
    ["Weed Management", 45, "Weed Management"],
    ["Pest Monitoring", 60, "Pest Management"],
    ["Harvesting", 120, "Harvesting"],
  ],
  Cotton: [
    ["Land Preparation", 0, "Land Preparation"],
    ["Sowing", 7, "Sowing"],
    ["First Irrigation", 20, "Irrigation"],
    ["Fertilizer Application", 35, "Fertilization"],
    ["Weed Management", 45, "Weed Management"],
    ["Pest Monitoring", 70, "Pest Management"],
    ["Harvesting", 170, "Harvesting"],
  ],
  Soybean: [
    ["Land Preparation", 0, "Land Preparation"],
    ["Seed Treatment", 3, "Sowing"],
    ["Sowing", 5, "Sowing"],
    ["First Irrigation", 20, "Irrigation"],
    ["Weed Management", 30, "Weed Management"],
    ["Pest Monitoring", 50, "Pest Management"],
    ["Harvesting", 100, "Harvesting"],
  ],
  Maize: [
    ["Land Preparation", 0, "Land Preparation"],
    ["Sowing", 7, "Sowing"],
    ["Irrigation", 20, "Irrigation"],
    ["Fertilizer Application", 30, "Fertilization"],
    ["Weed Management", 40, "Weed Management"],
    ["Pest Monitoring", 60, "Pest Management"],
    ["Harvesting", 100, "Harvesting"],
  ],
  Tomato: [
    ["Land Preparation", 0, "Land Preparation"],
    ["Transplanting", 15, "Sowing"],
    ["Irrigation", 20, "Irrigation"],
    ["Fertilizer Application", 30, "Fertilization"],
    ["Weed Management", 40, "Weed Management"],
    ["Pest Monitoring", 50, "Pest Management"],
    ["Harvesting", 90, "Harvesting"],
  ],
  Potato: [
    ["Land Preparation", 0, "Land Preparation"],
    ["Planting", 7, "Sowing"],
    ["Irrigation", 20, "Irrigation"],
    ["Fertilizer Application", 35, "Fertilization"],
    ["Earthing Up", 45, "Growth Monitoring"],
    ["Pest Monitoring", 60, "Pest Management"],
    ["Harvesting", 100, "Harvesting"],
  ],
  Onion: [
    ["Land Preparation", 0, "Land Preparation"],
    ["Transplanting", 20, "Sowing"],
    ["Irrigation", 25, "Irrigation"],
    ["Fertilizer Application", 40, "Fertilization"],
    ["Weed Management", 50, "Weed Management"],
    ["Pest Monitoring", 65, "Pest Management"],
    ["Harvesting", 120, "Harvesting"],
  ],
  Sugarcane: [
    ["Land Preparation", 0, "Land Preparation"],
    ["Planting", 7, "Sowing"],
    ["Irrigation", 20, "Irrigation"],
    ["Fertilizer Application", 45, "Fertilization"],
    ["Weed Management", 60, "Weed Management"],
    ["Pest Monitoring", 100, "Pest Management"],
    ["Harvesting", 300, "Harvesting"],
  ],
  Chickpea: [
    ["Land Preparation", 0, "Land Preparation"],
    ["Seed Treatment", 3, "Sowing"],
    ["Sowing", 5, "Sowing"],
    ["Irrigation", 25, "Irrigation"],
    ["Weed Management", 35, "Weed Management"],
    ["Pest Monitoring", 55, "Pest Management"],
    ["Harvesting", 100, "Harvesting"],
  ],
};
(async () => {
  await db();
  await Template.deleteMany({});
  for (const [name, arr] of Object.entries(schedules))
    await Template.create({
      name,
      category: "Field Crop",
      description: `Recommended ${name} cultivation calendar.`,
      typicalDuration: Math.max(...arr.map((x) => x[1])),
      activities: arr.map((x) => ({
        activityName: x[0],
        description: `Plan ${x[0].toLowerCase()} for ${name}.`,
        category: x[2],
        dayOffset: x[1],
        priority: x[2] === "Harvesting" ? "High" : "Medium",
        defaultReminderDays: 1,
      })),
    });
  const email = "admin@cropcalendar.local";
  if (!(await User.findOne({ email })))
    await User.create({
      name: "Platform Admin",
      email,
      password: await bcrypt.hash("Admin@123", 10),
      role: "admin",
    });
  console.log("Seed complete. Admin: admin@cropcalendar.local / Admin@123");
  process.exit();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
