
const BASE_URL = "http://localhost:3000";

async function testRoute(name, url, expectedStatus, token = null) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  try {
    const res = await fetch(`${BASE_URL}${url}`, { headers });
    if (res.status === expectedStatus) {
      console.log(`✅ [PASS] ${name} (${url}): Got ${res.status}`);
    } else {
      console.error(
        `❌ [FAIL] ${name} (${url}): Expected ${expectedStatus}, got ${res.status}`
      );
    }
  } catch (err) {
    console.error(`❌ [FAIL] ${name} (${url}): Network error`, err.message);
  }
}

async function runTests() {
  console.log("Starting API Security Verification...");
  
  // 1. Verify Public Routes (Should be 200)
  await testRoute("Public Categories", "/api/categories", 200);
  await testRoute("Public Tags", "/api/tags", 200);

  // 2. Verify Admin Routes are Secured (Should be 401 or 403 without token)
  await testRoute("Admin Categories (No Token)", "/api/admin/categories", 401);
  await testRoute("Admin Tags (No Token)", "/api/admin/tags", 401);

  // Note: We are not testing positive admin access here as we don't have a live token generator handy in this script,
  // but confirming negative access is the critical security check.
}

runTests();
