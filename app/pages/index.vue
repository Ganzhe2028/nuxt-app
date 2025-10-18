<script setup lang="ts">
import { computed } from 'vue'

const {
  books,
  members,
  activeLoans,
  overdueLoans,
  dueSoonLoans,
  getBookById,
  getMemberById,
  pending,
  error,
  refreshLibrary,
} = useLibraryData()

const totalBooks = computed(() => books.value.length)
const availableBooks = computed(
  () => books.value.filter((book) => book.status === 'available').length
)
const totalMembers = computed(() => members.value.length)
const activeLoanCount = computed(() => activeLoans.value.length)

const formatDate = (isoDate: string) =>
  new Date(isoDate + 'T00:00:00').toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
</script>

<template>
  <div class="dashboard">
    <template v-if="pending">
      <div class="loading-state">
        <p>Loading library data…</p>
      </div>
    </template>
    <template v-else-if="error">
      <div class="error-state">
        <p>Unable to load library data right now.</p>
        <button type="button" class="ghost" @click="refreshLibrary">
          Try again
        </button>
      </div>
    </template>
    <template v-else>
      <header class="page-header">
        <div>
          <p class="eyebrow">Overview</p>
          <h1>Library operations at a glance</h1>
        </div>
        <NuxtLink to="/loans" class="primary-action">Manage loans</NuxtLink>
      </header>

      <section class="stats-grid">
        <article class="stat-card">
          <p class="label">Books in catalog</p>
          <p class="value">{{ totalBooks }}</p>
          <p class="hint">{{ availableBooks }} available on shelves</p>
        </article>
        <article class="stat-card">
          <p class="label">Active loans</p>
          <p class="value">{{ activeLoanCount }}</p>
          <p class="hint">
            {{ overdueLoans.length }} overdue · {{ dueSoonLoans.length }} due
            soon
          </p>
        </article>
        <article class="stat-card">
          <p class="label">Members</p>
          <p class="value">{{ totalMembers }}</p>
          <p class="hint">Students & staff with borrowing rights</p>
        </article>
        <article class="stat-card">
          <p class="label">Resource highlights</p>
          <p class="value">
            {{ books.filter((book) => book.category === 'Technology').length }}
          </p>
          <p class="hint">STEM titles available for projects</p>
        </article>
      </section>

      <section class="panels">
        <article class="panel">
          <header>
            <h2>Active loans</h2>
            <NuxtLink to="/loans" class="text-link">View all loans</NuxtLink>
          </header>
          <p v-if="!activeLoans.length" class="empty-state">
            Great job! All books are back on the shelves.
          </p>
          <table v-else>
            <thead>
              <tr>
                <th>Book</th>
                <th>Borrower</th>
                <th>Borrowed</th>
                <th>Due</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="loan in activeLoans" :key="loan.id">
                <td>
                  <p class="table-primary">
                    {{ getBookById(loan.bookId)?.title ?? 'Unknown title' }}
                  </p>
                  <p class="table-secondary">
                    {{ getBookById(loan.bookId)?.author ?? '—' }}
                  </p>
                </td>
                <td>
                  <p class="table-primary">
                    {{ getMemberById(loan.memberId)?.name ?? 'Unknown member' }}
                  </p>
                  <p class="table-secondary">
                    {{ getMemberById(loan.memberId)?.grade ?? '' }}
                  </p>
                </td>
                <td>{{ formatDate(loan.borrowedAt) }}</td>
                <td>{{ formatDate(loan.dueAt) }}</td>
                <td>
                  <span
                    class="chip"
                    :class="{
                      overdue: overdueLoans.includes(loan),
                      warning: dueSoonLoans.includes(loan),
                    }"
                  >
                    {{
                      overdueLoans.includes(loan)
                        ? 'Overdue'
                        : dueSoonLoans.includes(loan)
                          ? 'Due soon'
                          : 'On track'
                    }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </article>

        <article class="panel">
          <header>
            <h2>Attention needed</h2>
          </header>
          <ul class="attention-list">
            <li v-if="!overdueLoans.length && !dueSoonLoans.length">
              No outstanding follow-ups. Keep monitoring daily.
            </li>
            <li v-for="loan in overdueLoans" :key="`overdue-${loan.id}`">
              <strong>
                {{ getMemberById(loan.memberId)?.name ?? 'Unknown' }}
              </strong>
              is
              {{
                Math.abs(
                  Math.ceil(
                    (new Date(loan.dueAt).getTime() - Date.now()) / 86400000
                  )
                )
              }}
              days past due on
              <em>{{ getBookById(loan.bookId)?.title ?? 'a book' }}</em>.
            </li>
            <li v-for="loan in dueSoonLoans" :key="`due-${loan.id}`">
              Reminder:
              <strong>
                {{ getMemberById(loan.memberId)?.name ?? 'Unknown' }}
              </strong>
              should return
              <em>{{ getBookById(loan.bookId)?.title ?? 'a book' }}</em>
              by {{ formatDate(loan.dueAt) }}.
            </li>
          </ul>
        </article>
      </section>
    </template>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 2rem;
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
  padding: 0.75rem 1.25rem;
  background: #2563eb;
  color: #fff;
  border-radius: 0.75rem;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 10px 20px rgba(37, 99, 235, 0.2);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.primary-action:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 24px rgba(37, 99, 235, 0.25);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
}

.stat-card {
  background: #fff;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
}

.stat-card .label {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: #0f172a;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.stat-card .value {
  margin: 0.5rem 0 0;
  font-size: 2.2rem;
  font-weight: 700;
  color: #1d4ed8;
}

.stat-card .hint {
  margin: 0.5rem 0 0;
  color: #64748b;
}

.panels {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
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
  align-items: center;
  margin-bottom: 1rem;
}

.panel h2 {
  margin: 0;
  font-size: 1.4rem;
  color: #0f172a;
}

.text-link {
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
}

.text-link:hover {
  text-decoration: underline;
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
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
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
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: #e0f2fe;
  color: #0f172a;
}

.chip.overdue {
  background: #fee2e2;
  color: #b91c1c;
}

.chip.warning {
  background: #fef3c7;
  color: #b45309;
}

.empty-state {
  margin: 2rem 0;
  text-align: center;
  color: #64748b;
}

.attention-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  color: #0f172a;
}

.attention-list strong {
  font-weight: 600;
}

.attention-list em {
  font-style: normal;
  font-weight: 500;
  color: #1d4ed8;
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

.ghost {
  padding: 0.6rem 1.1rem;
  border-radius: 0.75rem;
  border: 1px solid #cbd5f5;
  background: #fff;
  color: #1d4ed8;
  font-weight: 600;
  cursor: pointer;
}

.ghost:hover {
  border-color: #94a3b8;
}

@media (max-width: 1024px) {
  .panels {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .primary-action {
    width: 100%;
    text-align: center;
  }
}
</style>
