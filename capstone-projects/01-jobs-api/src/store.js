// In-memory store. Swap for SQLite/Postgres later without changing callers.

import { randomUUID } from 'node:crypto'

export function createStore() {
  const users = new Map()          // id → user
  const usersByEmail = new Map()   // email → id
  const jobs = new Map()           // id → job
  const applications = new Map()   // id → application

  return {
    users: {
      create(user) {
        const id = randomUUID()
        const record = { id, createdAt: new Date().toISOString(), ...user }
        users.set(id, record)
        usersByEmail.set(user.email, id)
        return record
      },
      findByEmail(email) {
        const id = usersByEmail.get(email)
        return id ? users.get(id) : null
      },
      find(id) { return users.get(id) ?? null },
    },
    jobs: {
      create(job) {
        const id = randomUUID()
        const record = { id, createdAt: new Date().toISOString(), ...job }
        jobs.set(id, record)
        return record
      },
      find(id) { return jobs.get(id) ?? null },
      list({ q, location, remote } = {}) {
        let results = [...jobs.values()]
        if (q) {
          const needle = q.toLowerCase()
          results = results.filter(
            (j) =>
              j.title.toLowerCase().includes(needle)
              || j.description.toLowerCase().includes(needle),
          )
        }
        if (location) results = results.filter((j) => j.location === location)
        if (remote === true) results = results.filter((j) => j.remote === true)
        return results.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      },
      update(id, patch) {
        const existing = jobs.get(id)
        if (!existing) return null
        const updated = { ...existing, ...patch, id, updatedAt: new Date().toISOString() }
        jobs.set(id, updated)
        return updated
      },
      delete(id) { return jobs.delete(id) },
    },
    applications: {
      create(application) {
        const id = randomUUID()
        const record = { id, createdAt: new Date().toISOString(), ...application }
        applications.set(id, record)
        return record
      },
      listByApplicant(applicantId) {
        return [...applications.values()].filter((a) => a.applicantId === applicantId)
      },
      hasApplied(jobId, applicantId) {
        for (const a of applications.values()) {
          if (a.jobId === jobId && a.applicantId === applicantId) return true
        }
        return false
      },
    },
  }
}
