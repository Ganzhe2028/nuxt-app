<script setup lang="ts">
import { computed, ref } from 'vue'

const { books, activeLoans, getMemberById, pending, error, refreshLibrary } =
  useLibraryData()

const statusFilter = ref<'all' | 'available' | 'on-loan' | 'reserved' | 'maintenance'>('all')
const searchTerm = ref('')

const activeLoanLookup = computed(() => {
  const lookup = new Map<number, (typeof activeLoans.value)[number]>()
  for (const loan of activeLoans.value) {
    lookup.set(loan.bookId, loan)
  }
  return lookup
})

const filteredBooks = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()
  return books.value.filter((book) => {
    const matchesStatus =
      statusFilter.value === 'all' || book.status === statusFilter.value
    const matchesSearch =
      !term ||
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term) ||
      book.category.toLowerCase().includes(term)
    return matchesStatus && matchesSearch
  })
})
</script>

<template>
  <div class="page">
    <template v-if="pending">
      <div class="loading-state">
        <p>Loading catalog…</p>
      </div>
    </template>
    <template v-else-if="error">
      <div class="error-state">
        <p>Unable to load books right now.</p>
        <button type="button" class="ghost" @click="refreshLibrary">
          Try again
        </button>
      </div>
    </template>
    <template v-else>
      <header class="page-header">
        <div>
          <p class="eyebrow">Catalog</p>
          <h1>Library collection</h1>
        </div>
        <button type="button" class="primary-action">Add new title</button>
      </header>

      <section class="filters">
        <label class="search">
          <span>Search</span>
          <input
            v-model="searchTerm"
            type="search"
            placeholder="Search by title, author, or subject"
          />
        </label>
        <label class="select">
          <span>Status</span>
          <select v-model="statusFilter">
            <option value="all">All</option>
            <option value="available">Available</option>
            <option value="on-loan">On loan</option>
            <option value="reserved">Reserved</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </label>
      </section>

      <section class="panel">
        <header>
          <h2>{{ filteredBooks.length }} books</h2>
          <p class="helper">
            Showing
            {{
              statusFilter === 'all'
                ? 'all availability states'
                : statusFilter.replace('-', ' ')
            }}
          </p>
        </header>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Level</th>
              <th>Status</th>
              <th>Borrower</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredBooks.length === 0">
              <td colspan="6" class="empty-state">
                No books match the current filters.
              </td>
            </tr>
            <tr v-for="book in filteredBooks" :key="book.id">
              <td>
                <p class="table-primary">{{ book.title }}</p>
                <p class="table-secondary">{{ book.author }}</p>
              </td>
              <td>{{ book.category }}</td>
              <td>{{ book.level }}</td>
              <td>
                <span class="chip" :class="book.status">
                  {{
                    book.status === 'on-loan'
                      ? 'On loan'
                      : book.status.charAt(0).toUpperCase() +
                        book.status.slice(1)
                  }}
                </span>
              </td>
              <td>
                <template v-if="activeLoanLookup.get(book.id)">
                  {{
                    getMemberById(activeLoanLookup.get(book.id)!.memberId)
                      ?.name ?? 'Unknown'
                  }}
                </template>
                <template v-else>—</template>
              </td>
              <td class="actions">
                <button type="button" class="ghost">Details</button>
                <button type="button" class="ghost">
                  {{ book.status === 'available' ? 'Lend book' : 'Reserve' }}
                </button>
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
  font-size: 0.75rem;
  font-weight: 600;
  background: #e2e8f0;
  color: #334155;
}

.chip.available {
  background: #dcfce7;
  color: #15803d;
}

.chip.on-loan {
  background: #dbeafe;
  color: #1d4ed8;
}

.chip.reserved {
  background: #fef3c7;
  color: #b45309;
}

.chip.maintenance {
  background: #fee2e2;
  color: #b91c1c;
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
