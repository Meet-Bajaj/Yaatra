const testRoutes = async () => {
  try {
    const adminRes = await fetch("http://localhost:5000/api/v1/admin/stats");
    const adminData = await adminRes.json();
    console.log("Admin Stats Response:", adminData);

    const driverRes = await fetch("http://localhost:5000/api/v1/driver/profile");
    const driverData = await driverRes.json();
    console.log("Driver Profile Response:", driverData);

    const authRes = await fetch("http://localhost:5000/api/v1/auth/register", { method: "POST" });
    const authData = await authRes.json();
    console.log("Auth Register Response:", authData);
    
    console.log("Tests completed successfully.");
  } catch (err) {
    console.error("Test failed:", err);
  }
};

testRoutes();
