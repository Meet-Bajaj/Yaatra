/* E2E regression test for the wired flows: offer creation, instances, matches,
 * scheduled + on-demand booking, driver accept/arrive/complete, schedules
 * pause/resume, wallet, pricing. Run: node e2e-newflows.js (backend on :5001)
 * Seeded logins only; safe to re-run (creates additional offers/bookings). */
const BASE = "http://localhost:5001";
let fails = 0;

const check = (label, cond, extra = "") => {
  if (cond) console.log(`  ✓ ${label}`);
  else { fails++; console.log(`  ✗ ${label} ${extra}`); }
};

async function login(phone, password) {
  const r = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, password }),
  });
  if (!r.ok) throw new Error(`login ${phone} failed: ${r.status} ${await r.text()}`);
  const j = await r.json();
  return { token: j.access_token, user: j.user };
}

const get = (token, path) =>
  fetch(`${BASE}${path}`, { headers: { Authorization: `Bearer ${token}` } });
const send = (token, method, path, body) =>
  fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: body ? JSON.stringify(body) : undefined,
  });

(async () => {
  const rider = await login("+919000000010", "user123");
  const driver = await login("+919000000100", "user123");
  console.log(`rider=${rider.user.name} driver=${driver.user.name}`);

  // ── 1. Driver vehicle exists ─────────────────────────────
  let vehicles = [];
  const vRes = await get(driver.token, "/users/me/vehicles");
  vehicles = await vRes.json();
  if (!Array.isArray(vehicles)) vehicles = [];
  console.log("\n[1] driver vehicles");
  check("has at least one vehicle", vehicles.length > 0, JSON.stringify(vehicles).slice(0, 200));
  if (vehicles.length === 0) { console.log("FATAL: no vehicle"); process.exit(1); }

  // ── 2. Create carpool offer (generates instances) ────────
  console.log("\n[2] create offer");
  const offerRes = await send(driver.token, "POST", "/driver/offer", {
    pickup: { lat: 12.9352, lng: 77.6245, address: "HSR Layout, Bengaluru" },
    drop: { lat: 12.9716, lng: 77.5946, address: "MG Road, Bengaluru" },
    schedule: [
      { day: "MONDAY", departureTime: "09:00" },
      { day: "TUESDAY", departureTime: "09:00" },
      { day: "WEDNESDAY", departureTime: "09:00" },
      { day: "THURSDAY", departureTime: "09:00" },
      { day: "FRIDAY", departureTime: "09:00" },
    ],
    seats: 2,
    pricePerSeat: 80,
    womenOnly: false,
    vehicleId: vehicles[0].id,
  });
  const offerText = await offerRes.text();
  check("POST /driver/offer 201", offerRes.status === 201, `${offerRes.status} ${offerText.slice(0, 300)}`);
  let offer = null;
  try { offer = JSON.parse(offerText); } catch {}
  check("offer has instances", Array.isArray(offer?.instances) && offer.instances.length > 0,
    `instances=${offer?.instances?.length}`);

  // ── 3. Rider matches ─────────────────────────────────────
  console.log("\n[3] rider matches");
  const mRes = await get(rider.token,
    "/rides/schedules/matches?pickupLat=12.9352&pickupLng=77.6245&dropLat=12.9716&dropLng=77.5946");
  const mText = await mRes.text();
  check("GET matches 200", mRes.status === 200, `${mRes.status} ${mText.slice(0, 200)}`);
  let matches = [];
  try { matches = JSON.parse(mText).matches || []; } catch {}
  check("has matches", matches.length > 0, `count=${matches.length}`);
  if (matches.length === 0) { console.log("FATAL: no matches"); process.exit(1); }

  // ── 4. Book scheduled instance ───────────────────────────
  console.log("\n[4] book scheduled");
  const bkRes = await send(rider.token, "POST", "/rides/book", {
    type: "SCHEDULED",
    instanceId: matches[0].instanceId,
    seats: 1,
    pickupAddress: "HSR Layout, Bengaluru",
    dropAddress: "MG Road, Bengaluru",
    paymentMethod: "WALLET",
  });
  const bkText = await bkRes.text();
  check("POST /rides/book SCHEDULED 201", bkRes.status === 201, `${bkRes.status} ${bkText.slice(0, 300)}`);

  // ── 5. Schedules page data ───────────────────────────────
  console.log("\n[5] GET /rides/schedules");
  const sRes = await get(rider.token, "/rides/schedules");
  const sText = await sRes.text();
  check("200", sRes.status === 200, `${sRes.status}`);
  let sched = {};
  try { sched = JSON.parse(sText); } catch {}
  check("asRider has booking", (sched.asRider || []).length > 0, `asRider=${(sched.asRider || []).length}`);

  const dSchedRes = await get(driver.token, "/rides/schedules");
  const dSched = await dSchedRes.json().catch(() => ({}));
  check("asDriver has offer", (dSched.asDriver || []).length > 0, `asDriver=${(dSched.asDriver || []).length}`);

  // pause/resume
  const offerId = (dSched.asDriver || [])[0]?.id;
  if (offerId) {
    const pRes = await send(driver.token, "PATCH", `/driver/offers/${offerId}`, { status: "PAUSED" });
    check("PATCH offer PAUSED", pRes.status === 200, `${pRes.status} ${(await pRes.text()).slice(0, 200)}`);
    const rRes = await send(driver.token, "PATCH", `/driver/offers/${offerId}`, { status: "ACTIVE" });
    check("PATCH offer ACTIVE", rRes.status === 200, `${rRes.status}`);
  }

  // ── 6. Driver goes online ────────────────────────────────
  console.log("\n[6] driver online + on-demand trip");
  const onRes = await send(driver.token, "POST", "/driver/go-online", {
    lat: 12.9352, lng: 77.6245, zone: "HSR",
    vehicleId: vehicles[0].id,
  });
  check("go-online", onRes.status === 201 || onRes.status === 200, `${onRes.status} ${(await onRes.text()).slice(0, 200)}`);

  // ── 7. Rider books on-demand (fresh trip) ────────────────
  const odRes = await send(rider.token, "POST", "/rides/book", {
    type: "ON_DEMAND",
    pickupLat: 12.9352, pickupLng: 77.6245,
    dropLat: 12.9716, dropLng: 77.5946,
    pickupAddress: "HSR Layout, Bengaluru",
    dropAddress: "MG Road, Bengaluru",
    seats: 1,
    paymentMethod: "WALLET",
  });
  const odText = await odRes.text();
  check("POST /rides/book ON_DEMAND 201", odRes.status === 201, `${odRes.status} ${odText.slice(0, 300)}`);
  let trip = null;
  try { trip = JSON.parse(odText); } catch {}

  // ── 8. Driver sees request, accepts, arrives, completes ──
  console.log("\n[7] driver request lifecycle");
  const reqRes = await get(driver.token, "/driver/requests");
  const reqText = await reqRes.text();
  check("GET /driver/requests 200", reqRes.status === 200, `${reqRes.status} ${reqText.slice(0, 200)}`);
  let reqs = [];
  try { reqs = JSON.parse(reqText); } catch {}
  const searchTrip = reqs.find((t) => t.status === "SEARCHING");
  check("sees SEARCHING trip", !!searchTrip, `reqs=${reqs.length}`);

  if (searchTrip) {
    const aRes = await send(driver.token, "POST", "/driver/accept", { tripId: searchTrip.id });
    check("accept", aRes.status === 201 || aRes.status === 200, `${aRes.status} ${(await aRes.text()).slice(0, 200)}`);

    const arrRes = await send(driver.token, "POST", `/driver/trips/${searchTrip.id}/arrive`);
    check("arrive", arrRes.status === 201 || arrRes.status === 200, `${arrRes.status} ${(await arrRes.text()).slice(0, 200)}`);

    const compRes = await send(driver.token, "POST", `/driver/trips/${searchTrip.id}/complete`);
    check("complete", compRes.status === 201 || compRes.status === 200, `${compRes.status} ${(await compRes.text()).slice(0, 200)}`);
  }

  // ── 9. Wallet transactions shape ─────────────────────────
  console.log("\n[8] wallet");
  const wRes = await get(rider.token, "/wallet/transactions");
  const wText = await wRes.text();
  check("GET /wallet/transactions 200", wRes.status === 200, `${wRes.status}`);
  let wj = null;
  try { wj = JSON.parse(wText); } catch {}
  check("returns {transactions}", Array.isArray(wj?.transactions), wText.slice(0, 200));

  const wdRes = await send(rider.token, "POST", "/wallet/withdraw", { amount: 1100 });
  check("withdraw 2xx or 400", (wdRes.status >= 200 && wdRes.status < 300) || wdRes.status === 400,
    `${wdRes.status} ${(await wdRes.text()).slice(0, 200)}`);

  // ── 10. Pricing estimate GET ─────────────────────────────
  console.log("\n[9] pricing");
  const pRes = await get(rider.token, "/pricing/estimate?type=PROFESSIONAL&distanceKm=8.5&durationMin=26&surgeMultiplier=1");
  const pText = await pRes.text();
  check("GET estimate 200", pRes.status === 200, `${pRes.status} ${pText.slice(0, 200)}`);
  let pj = null; try { pj = JSON.parse(pText); } catch {}
  check("has totalFare", typeof pj?.totalFare === "number", pText.slice(0, 200));

  // ── 11. Available rides (unwrap shape) ───────────────────
  const avRes = await get(rider.token, "/rides/available?pickupLat=12.9352&pickupLng=77.6245&dropLat=12.9716&dropLng=77.5946&sortBy=price");
  const avText = await avRes.text();
  let av = null; try { av = JSON.parse(avText); } catch {}
  check("available returns {results}", Array.isArray(av?.results), avText.slice(0, 200));

  console.log(fails === 0 ? "\nALL PASSED" : `\n${fails} FAILURES`);
  process.exit(fails === 0 ? 0 : 1);
})().catch((e) => { console.error("FATAL", e); process.exit(1); });
