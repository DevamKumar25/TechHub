import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Employee from "./models/employee.js";
import Client from "./models/client.js";
import Project from "./models/project.js";
import Counter from "./models/counter.js";

dotenv.config();

const seedDB = async () => {
  try {
    await connectDB();

    console.log("🧹 Clearing existing collections...");
    await User.deleteMany({});
    await Employee.deleteMany({});
    await Client.deleteMany({});
    await Project.deleteMany({});
    await Counter.deleteMany({});

    console.log("👥 Seeding admin user...");
    const admin = await User.create({
      name: "raj kumar",
      email: "raj758@gmail.com",
      password: "rajkumar",
      role: "admin",
    });
    console.log(`✅ Admin registered with email: ${admin.email} and password: password123`);

    console.log("👥 Seeding employees...");
    const employee1 = await Employee.create({
      employeeId: "CE054",
      name: "Devam",
      email: "devama271@gmail.com",
      phoneNumber: "987657383210",
      profilePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      designation: "software Developer",
      department: "Backend",
      branch: "Hyderabad",
      role: "Team Lead",
      joiningDate: new Date("2023-07-01"),
      status: "Active",
      profileCompletion: 100,
      address: "Hyderabad, India",
    });

    const employee2 = await Employee.create({
      employeeId: "CE055",
      name: "nargeshi",
      email: "nargeshij@gmail.com",
      phoneNumber: "98765789211",
      profilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      designation: " software Developer",
      department: "frontend",
      branch: "Hyderabad",
      role: "Employee",
      joiningDate: new Date("2023-07-02"),
      status: "Active",
      profileCompletion: 76,
      address: "Hyderabad, India",
    });

    const employee3 = await Employee.create({
      employeeId: "CE080",
      name: "devanshi",
      email: "devanshi@gmail.com",
      phoneNumber: "98765789256",
      profilePhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
      designation: "UI/UX Designer",
      department: "design",
      branch: "Hyderabad",
      role: "Employee",
      joiningDate: new Date("2026-03-23"),
      status: "Active",
      profileCompletion: 81,
      address: "Hyderabad, India",
    });

    console.log("👥 Seeding counters...");
    await Counter.create([
      { _id: "employeeId", seq: 80 },
      { _id: "clientId", seq: 2 }
    ]);

    console.log("👥 Seeding clients...");
    const client1 = await Client.create({
      clientId: "CLT001",
      clientName: "Google LLC",
      companyName: "Google",
      email: "contact@google.com",
      phoneNumber: "1234567890",
      status: "Active",
      memberSince: new Date("2022-01-01"),
    });

    const client2 = await Client.create({
      clientId: "CLT002",
      clientName: "Microsoft Corporation",
      companyName: "Microsoft",
      email: "contact@microsoft.com",
      phoneNumber: "1234567891",
      status: "Active",
      memberSince: new Date("2023-01-01"),
    });

    console.log("👥 Seeding projects...");
    await Project.create([
      {
        projectId: "P-123456",
        client: client1._id,
        clientName: "Google",
        projectName: "Search Ads Integration",
        projectType: "Web App",
        status: "Active",
        totalCost: 150000,
        pendingAmount: 45000,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-12-31"),
        team: [{ employee: employee1._id, roleInProject: "Lead" }, { employee: employee2._id, roleInProject: "Backend Developer" }],
      },
      {
        projectId: "P-654321",
        client: client2._id,
        clientName: "Microsoft",
        projectName: "Teams Notification Extension",
        projectType: "API Service",
        status: "Active",
        totalCost: 80000,
        pendingAmount: 12000,
        startDate: new Date("2024-03-15"),
        endDate: new Date("2024-09-30"),
        team: [{ employee: employee1._id, roleInProject: "Lead" }, { employee: employee3._id, roleInProject: "Backend Developer" }],
      }
    ]);

    console.log("🎉 Database seeded successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedDB();
