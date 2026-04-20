const mongoose = require("mongoose");

const User = require("../models/users");
const { generateToken } = require("../utils/jwt");

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";
const LOCAL_MONGO = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/RickRide";

async function request(method, path, body, token) {
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await response.json();
  } catch (_error) {
    data = { raw: await response.text() };
  }

  return {
    status: response.status,
    ok: response.ok,
    data,
  };
}

(async () => {
  await mongoose.connect(LOCAL_MONGO);

  const admin = await User.findOne({ role: "admin", isDeleted: false, isActive: true }).select("_id role phone");
  if (!admin) {
    throw new Error("No active admin user found in database. Seed admin first.");
  }

  const adminToken = generateToken(admin._id, admin.role);

  const timestamp = Date.now();
  const phone = `+91813${String(timestamp).slice(-7)}`;
  const email = `e2e_${timestamp}@rickride.local`;

  const registerRes = await request("POST", "/api/v1/auth/register", {
    phone,
    name: "E2E Rider",
    email,
    password: "Password@123",
    role: "rider",
  });

  const createdUserId = registerRes.data?.data?.user?._id;

  const loginBeforeDeleteRes = await request("POST", "/api/v1/auth/login", { phone });

  let deleteRes = { status: null, data: { message: "skipped" } };
  if (createdUserId) {
    deleteRes = await request("DELETE", `/api/v1/admin/users/${createdUserId}`, null, adminToken);
  }

  const loginAfterDeleteRes = await request("POST", "/api/v1/auth/login", { phone });

  const result = {
    baseUrl: BASE_URL,
    phone,
    adminId: String(admin._id),
    register: {
      status: registerRes.status,
      message: registerRes.data?.message,
    },
    loginBeforeDelete: {
      status: loginBeforeDeleteRes.status,
      message: loginBeforeDeleteRes.data?.message,
      success: loginBeforeDeleteRes.data?.success,
    },
    deleteUser: {
      status: deleteRes.status,
      message: deleteRes.data?.message,
      success: deleteRes.data?.success,
    },
    loginAfterDelete: {
      status: loginAfterDeleteRes.status,
      message: loginAfterDeleteRes.data?.message,
      success: loginAfterDeleteRes.data?.success,
      expected: "Should fail for deleted user",
    },
  };

  console.log(JSON.stringify(result, null, 2));

  await mongoose.disconnect();
})();
