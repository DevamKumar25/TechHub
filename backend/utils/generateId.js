import Counter from "../models/counter.js";
import Project from "../models/project.js";

/**
 * Atomically increments a named counter and returns the new value.
 * Using findByIdAndUpdate with $inc + upsert avoids race conditions that
 * "find the last record and add 1" would have under concurrent requests.
 */
async function getNextSequence(counterName) {
  const counter = await Counter.findByIdAndUpdate(
    counterName,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return counter.seq;
}

// e.g. "CE054"
export async function generateEmployeeId() {
  const seq = await getNextSequence("employeeId");
  return `CE${String(seq).padStart(3, "0")}`;
}

// e.g. "CLT050"
export async function generateClientId() {
  const seq = await getNextSequence("clientId");
  return `CLT${String(seq).padStart(3, "0")}`;
}

// e.g. "P-432835" — the list page shows random-looking 6-digit codes rather
// than sequential ones, so we generate a random number and retry on collision.
export async function generateProjectId() {
  let id;
  let exists = true;

  while (exists) {
    const random = Math.floor(100000 + Math.random() * 900000);
    id = `P-${random}`;
    // eslint-disable-next-line no-await-in-loop
    exists = await Project.exists({ projectId: id });
  }

  return id;
}