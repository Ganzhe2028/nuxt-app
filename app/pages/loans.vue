<script setup lang="ts">
import { computed, ref } from 'vue'

const {
  loans,
  activeLoans,
  overdueLoans,
  dueSoonLoans,
  getBookById,
  getMemberById,
  pending,
  error,
  refreshLibrary,
} = useLibraryData()

const showHistory = ref(false)

const sortedActiveLoans = computed(() =>
  [...activeLoans.value].sort(
    (a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()
  )
)

const returnedLoans = computed(() =>
  loans.value
    .filter((loan) => loan.returnedAt)
    .sort(
      (a, b) =>
        new Date(b.returnedAt!).getTime() - new Date(a.returnedAt!).getTime()
    )
)

const loanStatus = (loanId: number) => {
  const loan =
    activeLoans.value.find((entry) => entry.id === loanId) ??
    loans.value.find((entry) => entry.id === loanId)

  if (!loan) {
    return 'Unknown'
  }

  if (loan.returnedAt) {
    return 'Returned'
  }

  if (overdueLoans.value.some((item) => item.id === loan.id)) {
    return 'Overdue'
  }

  if (dueSoonLoans.value.some((item) => item.id === loan.id)) {
    return 'Due soon'
  }

  return 'On track'
}

const formatDate = (isoDate: string | undefined) =>
  isoDate
    ? new Date(isoDate + 'T00:00:00').toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      })
    : '—'
</script>

<template>
  <div class="page">
    <template v-if="pending">
      <div class="loading-state">
        <p>Loading loan records…</p>
      </div>
    </template>
    <template v-else-if="error">
      <div class="error-state">
        <p>Unable to load loan records right now.</p>
        <button type="button" class="ghost" @click="refreshLibrary">
          Try again
        </button>
      </div>
    </template>
    <template v-else>
      <header class="page-header">
        <div>
          <p class="eyebrow">Circulation</p>
          <h1>Loan management</h1>
        </div>
        <div class="actions">
          <button type="button" class="ghost">Record return</button>
          <button type="button" class="primary-action">Create loan</button>
        </div>
      </header>

      <section class="panels">
        <article class="panel primary">
        <header>
          <div>
            <h2>Active loans</h2>
            <p class="helper">
              {{ overdueLoans.length }} overdue · {{ dueSoonLoans.length }} due
              in the next 3 days
            </p>
          </div>
          <label class="toggle">
            <input v-model="showHistory" type="checkbox" />
            <span>Show return history</span>
          </label>
        </header>

        <table>
          <thead>
            <tr>
              <th>Book</th>
              <th>Borrower</th>
              <th>Borrowed</th>
              <th>Due</th>
              <th>Status</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="sortedActiveLoans.length === 0">
              <td colspan="6" class="empty-state">
                No books are currently on loan.
              </td>
            </tr>
            <tr v-for="loan in sortedActiveLoans" :key="loan.id">
              <td>
                <p class="table-primary">
                  {{ getBookById(loan.bookId)?.title ?? 'Unknown title' }}
                </p>
                <p class="table-secondary">
                  {{ getBookById(loan.bookId)?.category ?? '—' }}
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
                    overdue: loanStatus(loan.id) === 'Overdue',
                    warning: loanStatus(loan.id) === 'Due soon',
                  }"
                >
                  {{ loanStatus(loan.id) }}
                </span>
              </td>
              <td>{{ loan.notes ?? '—' }}</td>
            </tr>
          </tbody>
        </table>
      </article>

      <article v-if="showHistory" class="panel history">
        <header>
          <h2>Recently returned</h2>
        </header>
        <table>
          <thead>
            <tr>
              <th>Book</th>
              <th>Member</th>
              <th>Borrowed</th>
              <th>Returned</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="returnedLoans.length === 0">
              <td colspan="4" class="empty-state">
                No completed loans yet.
              </td>
            </tr>
            <tr v-for="loan in returnedLoans" :key="loan.id">
              <td>
                <p class="table-primary">
                  {{ getBookById(loan.bookId)?.title ?? 'Unknown title' }}
                </p>
                <p class="table-secondary">
                  {{ getBookById(loan.bookId)?.category ?? '—' }}
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
              <td>{{ formatDate(loan.returnedAt) }}</td>
            </tr>
          </tbody>
        </table>
      </article>
    </section>
    </template>
  </div>
</template>

<style scoped>
.page {
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

.actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.primary-action {
  padding: 0.7rem 1.2rem;
  background: #1d4ed8;
  color: #fff;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(29, 78, 216, 0.2);
}

.primary-action:hover {
  box-shadow: 0 12px 24px rgba(29, 78, 216, 0.25);
}

.ghost {
  padding: 0.7rem 1.2rem;
  border: 1px solid #cbd5f5;
  border-radius: 0.75rem;
  background: #fff;
  color: #1d4ed8;
  font-weight: 600;
  cursor: pointer;
}

.ghost:hover {
  border-color: #94a3b8;
}

.panels {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 1.5rem;
}

.panel {
  background: #fff;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.panel.primary {
  grid-column: 1 / -1;
}

.panel header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
}

.panel h2 {
  margin: 0;
  font-size: 1.4rem;
  color: #0f172a;
}

.helper {
  margin: 0.25rem 0 0;
  color: #64748b;
}

.toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
}

.toggle input {
  accent-color: #2563eb;
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
  font-size: 0.75rem;
  font-weight: 600;
  background: #e2e8f0;
  color: #334155;
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

  .actions {
    width: 100%;
    justify-content: stretch;
  }

  .actions button {
    flex: 1 1 auto;
  }
}
</style>
