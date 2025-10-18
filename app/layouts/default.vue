<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <div class="layout">
    <header class="top-bar">
      <NuxtLink to="/" class="brand">
        <span class="brand-mark">🏫</span>
        <span class="brand-text">School Library</span>
      </NuxtLink>
      <nav class="primary-nav">
        <NuxtLink to="/" exact-active-class="active" class="nav-item">
          Dashboard
        </NuxtLink>
        <NuxtLink to="/books" active-class="active" class="nav-item">
          Books
        </NuxtLink>
        <NuxtLink to="/members" active-class="active" class="nav-item">
          Members
        </NuxtLink>
        <NuxtLink to="/loans" active-class="active" class="nav-item">
          Loans
        </NuxtLink>
      </nav>
    </header>

    <main class="page-body">
      <slot />
    </main>

    <footer class="page-footer">
      <p>© {{ currentYear }} Greenwood School Library</p>
      <p>Need help? library@school.edu · Ext. 204</p>
    </footer>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f8fafc;
  color: #0f172a;
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: #1e40af;
  color: #fff;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.2);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: inherit;
  font-weight: 600;
  text-decoration: none;
}

.brand-mark {
  font-size: 1.5rem;
}

.brand-text {
  letter-spacing: 0.02em;
}

.primary-nav {
  display: flex;
  gap: 1rem;
}

.nav-item {
  padding: 0.5rem 0.75rem;
  border-radius: 0.75rem;
  color: #e0e7ff;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.15s ease, color 0.15s ease;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nav-item.active {
  background: #fff;
  color: #1e40af;
}

.page-body {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

.page-footer {
  padding: 1.5rem 2rem;
  background: #1e3a8a;
  color: #cbd5f5;
  text-align: center;
  font-size: 0.9rem;
}

.page-footer p {
  margin: 0.25rem 0;
}

@media (max-width: 768px) {
  .top-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .primary-nav {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .page-body {
    padding: 1.5rem;
  }
}
</style>
