// Run with `npm test` in this folder (needs Java for the Firestore emulator).
// Each case mirrors a real read or write from apps/chronatra, apps/hub, apps/joatra or packages/core.
import { readFileSync } from "node:fs";
import { after, before, beforeEach, describe, test } from "node:test";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

const ME = "chris";
const OTHER = "mallory";

let env;

before(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-luatra",
    firestore: {
      rules: readFileSync(new URL("../firestore.rules", import.meta.url), "utf8"),
      host: "127.0.0.1",
      port: 8089,
    },
  });
});

after(async () => {
  await env.cleanup();
});

beforeEach(async () => {
  await env.clearFirestore();
  // Seed documents with rules disabled, like existing production data.
  await env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    await setDoc(doc(db, "apps/chronatra/timeEntries/mine"), {
      userId: ME, isRunning: true, startTime: new Date("2026-09-24T08:00:00Z"), description: "VISION",
    });
    await setDoc(doc(db, "apps/chronatra/timeEntries/theirs"), {
      userId: OTHER, isRunning: false, startTime: new Date("2026-09-24T08:00:00Z"),
    });
    await setDoc(doc(db, "apps/chronatra/projects/p1"), { userId: ME, name: "AthenaRun" });
    for (const col of ["jobs", "profiles", "generatedCVs"]) {
      await setDoc(doc(db, `${col}/mine`), { userId: ME, createdAt: new Date() });
      await setDoc(doc(db, `${col}/theirs`), { userId: OTHER, createdAt: new Date() });
    }
    await setDoc(doc(db, "activities/a1"), { userId: ME, app: "chronatra", createdAt: new Date() });
  });
});

const me = () => env.authenticatedContext(ME).firestore();
const other = () => env.authenticatedContext(OTHER).firestore();
const anon = () => env.unauthenticatedContext().firestore();

describe("chronatra time entries", () => {
  test("owner lists own entries (TimeEntryList, reports, Hub stats)", async () => {
    await assertSucceeds(getDocs(query(
      collection(me(), "apps/chronatra/timeEntries"),
      where("userId", "==", ME), orderBy("startTime", "desc"), limit(20),
    )));
  });

  test("owner finds running entry (TimerContext resume)", async () => {
    await assertSucceeds(getDocs(query(
      collection(me(), "apps/chronatra/timeEntries"),
      where("userId", "==", ME), where("isRunning", "==", true), limit(1),
    )));
  });

  test("owner starts a timer", async () => {
    await assertSucceeds(addDoc(collection(me(), "apps/chronatra/timeEntries"), {
      userId: ME, isRunning: true, startTime: new Date(), description: "x",
    }));
  });

  test("owner stops a timer, incl. correction note (TimerContext, Hub widget)", async () => {
    await assertSucceeds(updateDoc(doc(me(), "apps/chronatra/timeEntries/mine"), {
      endTime: new Date(), duration: 1000, isRunning: false,
      correction: { reason: "stale-timer", runningMsWhenFlagged: 90_000_000 },
    }));
  });

  test("owner deletes own entry", async () => {
    await assertSucceeds(deleteDoc(doc(me(), "apps/chronatra/timeEntries/mine")));
  });

  test("nobody can create an entry for someone else", async () => {
    await assertFails(addDoc(collection(me(), "apps/chronatra/timeEntries"), {
      userId: OTHER, isRunning: true, startTime: new Date(),
    }));
  });

  test("owner cannot hand an entry to another user", async () => {
    await assertFails(updateDoc(doc(me(), "apps/chronatra/timeEntries/mine"), { userId: OTHER }));
  });

  test("other users cannot read, change or delete my entry", async () => {
    await assertFails(getDoc(doc(other(), "apps/chronatra/timeEntries/mine")));
    await assertFails(updateDoc(doc(other(), "apps/chronatra/timeEntries/mine"), { duration: 1 }));
    await assertFails(deleteDoc(doc(other(), "apps/chronatra/timeEntries/mine")));
  });

  test("listing without the userId filter is denied", async () => {
    await assertFails(getDocs(collection(me(), "apps/chronatra/timeEntries")));
  });

  test("signed-out access is denied", async () => {
    await assertFails(getDoc(doc(anon(), "apps/chronatra/timeEntries/mine")));
    await assertFails(getDocs(query(collection(anon(), "apps/chronatra/timeEntries"), where("userId", "==", ME))));
  });
});

describe("chronatra projects", () => {
  test("owner lists, reads and creates projects", async () => {
    await assertSucceeds(getDocs(query(
      collection(me(), "apps/chronatra/projects"), where("userId", "==", ME), orderBy("name", "asc"),
    )));
    await assertSucceeds(getDoc(doc(me(), "apps/chronatra/projects/p1")));
    await assertSucceeds(addDoc(collection(me(), "apps/chronatra/projects"), { userId: ME, name: "New" }));
  });

  test("other users cannot read my project", async () => {
    await assertFails(getDoc(doc(other(), "apps/chronatra/projects/p1")));
  });
});

for (const col of ["jobs", "profiles", "generatedCVs"]) {
  describe(`joatra ${col}`, () => {
    test("owner lists, reads, creates, updates and deletes own docs", async () => {
      await assertSucceeds(getDocs(query(collection(me(), col), where("userId", "==", ME))));
      await assertSucceeds(getDoc(doc(me(), `${col}/mine`)));
      await assertSucceeds(addDoc(collection(me(), col), { userId: ME, createdAt: new Date() }));
      await assertSucceeds(updateDoc(doc(me(), `${col}/mine`), { note: "x" }));
      await assertSucceeds(deleteDoc(doc(me(), `${col}/mine`)));
    });

    test("foreign docs stay private", async () => {
      await assertFails(getDoc(doc(me(), `${col}/theirs`)));
      await assertFails(updateDoc(doc(me(), `${col}/theirs`), { note: "x" }));
      await assertFails(getDocs(collection(me(), col)));
    });
  });
}

describe("activities (Hub feed)", () => {
  test("owner reads own feed and appends", async () => {
    await assertSucceeds(getDocs(query(
      collection(me(), "activities"), where("userId", "==", ME), orderBy("createdAt", "desc"), limit(10),
    )));
    await assertSucceeds(addDoc(collection(me(), "activities"), { userId: ME, app: "chronatra", createdAt: new Date() }));
  });

  test("feed is append-only and private", async () => {
    await assertFails(updateDoc(doc(me(), "activities/a1"), { app: "x" }));
    await assertFails(deleteDoc(doc(me(), "activities/a1")));
    await assertFails(getDoc(doc(other(), "activities/a1")));
  });
});

test("unknown collections are denied", async () => {
  await assertFails(setDoc(doc(me(), "anything/else"), { userId: ME }));
});
