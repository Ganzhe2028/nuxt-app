<script setup lang="ts">
import { computed, ref } from 'vue'

const { members, activeLoans, pending, error, refreshLibrary } =
  useLibraryData()

const gradeFilter = ref<'all' | 'Grade 6' | 'Grade 7' | 'Grade 8' | 'Grade 9' | 'Grade 10' | 'Grade 11' | 'Grade 12' | 'Teacher'>('all')
const searchTerm = ref('')

const activeLoanCounts = computed(() => {
  const counts = new Map<number, number>()
  for (const loan of activeLoans.value) {
    counts.set(loan.memberId, (counts.get(loan.memberId) ?? 0) + 1)
  }
  return counts
})

const filteredMembers = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()
  return members.value.filter((member) => {
    const matchesGrade =
      gradeFilter.value === 'all' || member.grade === gradeFilter.value
    const matchesSearch =
      !term ||
      member.name.toLowerCase().includes(term) ||
      member.email.toLowerCase().includes(term)
    return matchesGrade && matchesSearch
  })
})
</script>

<template>
  <div class="page">
    <template v-if="pending">
      <div class="loading-state">
        <p>Loading members…</p>
      </div>
    </template>
    <template v-else-if="error">
      <div class="error-state">
        <p>Unable to load members right now.</p>
        <button type="button" class="ghost" @click="refreshLibrary">
          Try again
        </button>
      </div>
    </template>
    <template v-else>
      <header class="page-header">
        <div>
          <p class="eyebrow">Community</p>
          <h1>Library members</h1>
        </div>
        <button type="button" class="primary-action">Invite member</button>
      </header>

      <section class="filters">
        <label>
          <span>Search</span>
          <input
            v-model="searchTerm"
            type="search"
            placeholder="Search by name or email"
          />
        </label>
        <label>
          <span>Group</span>
          <select v-model="gradeFilter">
            <option value="all">All</option>
            <option value="Grade 6">Grade 6</option>
            <option value="Grade 7">Grade 7</option>
            <option value="Grade 8">Grade 8</option>
            <option value="Grade 9">Grade 9</option>
            <option value="Grade 10">Grade 10</option>
            <option value="Grade 11">Grade 11</option>
            <option value="Grade 12">Grade 12</option>
            <option value="Teacher">Teachers</option>
          </select>
        </label>
      </section>

      <section class="panel">
        <header>
          <h2>{{ filteredMembers.length }} active members</h2>
          <p class="helper">
            {{
              activeLoans.length
            }}
            books currently on loan
          </p>
        </header>
        <table>
          <thead>
            <tr>
              <th>Member</th>
              <th>Group</th>
              <th>Contact</th>
              <th>Active loans</th>
              <th>Next steps</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredMembers.length === 0">
              <td colspan="5" class="empty-state">
                No members match the current filters.
              </td>
            </tr>
            <tr v-for="member in filteredMembers" :key="member.id">
              <td>
                <p class="table-primary">{{ member.name }}</p>
                <p class="table-secondary">{{ member.email }}</p>
              </td>
              <td>{{ member.grade }}</td>
              <td>{{ member.phone }}</td>
              <td>
                <span class="chip">
                  {{ activeLoanCounts.get(member.id) ?? 0 }}
                </span>
              </td>
              <td class="actions">
                <button type="button" class="ghost">Message</button>
                <button type="button" class="ghost">View history</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </template>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.75rem;
  margin: 0;
  color: #64748b;
}

.page-header h1 {
  margin: 0.3rem 0 0;
  font-size: 2rem;
  color: #0f172a;
}

.primary-action {
  padding: 0.7rem 1.2rem;
  background: #0f766e;
  color: #fff;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(15, 118, 110, 0.2);
}

.primary-action:hover {
  box-shadow: 0 12px 24px rgba(15, 118, 110, 0.25);
}

.filters {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.filters label {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-weight: 600;
  color: #475569;
}

input[type='search'],
select {
  padding: 0.6rem 0.75rem;
  border-radius: 0.6rem;
  border: 1px solid #cbd5f5;
  background: #fff;
  min-width: 240px;
  font: inherit;
  color: #0f172a;
}

.panel {
  background: #fff;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.panel header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 1rem;
}

.panel h2 {
  margin: 0;
  font-size: 1.4rem;
  color: #0f172a;
}

.helper {
  margin: 0;
  color: #64748b;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  text-align: left;
  padding: 0.75rem;
}

thead th {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #475569;
  border-bottom: 1px solid #e2e8f0;
}

tbody tr:not(:last-child) td {
  border-bottom: 1px solid #f1f5f9;
}

.table-primary {
  margin: 0;
  font-weight: 600;
  color: #0f172a;
}

.table-secondary {
  margin: 0.15rem 0 0;
  font-size: 0.85rem;
  color: #64748b;
}

.chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  background: #dbeafe;
  color: #1d4ed8;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.ghost {
  padding: 0.45rem 0.9rem;
  border: 1px solid #cbd5f5;
  border-radius: 0.6rem;
  background: #fff;
  cursor: pointer;
  font-weight: 500;
}

.ghost:hover {
  border-color: #94a3b8;
}

.empty-state {
  text-align: center;
  color: #64748b;
}

.loading-state,
.error-state {
  background: #fff;
  border-radius: 1rem;
  padding: 2.5rem 2rem;
  text-align: center;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  color: #475569;
}

.error-state {
  color: #b91c1c;
}

.loading-state p,
.error-state p {
  margin: 0 0 1rem;
  font-size: 1.05rem;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .primary-action {
    width: 100%;
  }

  .actions {
    flex-wrap: wrap;
  }

  .actions button {
    flex: 1 1 auto;
  }
}
</style>
