/**
 * js/views/admin/users.js
 * Admin User Management — view, search, add, edit, delete users.
 */
import { apiGet, apiPost, apiPatch, apiDelete, NotImplementedError } from '../../api/client.js';
import { showToast } from '../../components/toast.js';
import { openModal, closeModal } from '../../components/modal.js';
import { withSkeleton } from '../../components/skeleton.js';
import { createEmptyState } from '../../components/emptyState.js';
import { createBadge } from '../../components/badge.js';
import { ROLE_LABELS } from '../../api/auth.js';

// Mock users
let mockUsers = [
  { id: 1, name: 'Sara Mohamed', email: 'sara@ctu.edu.eg', role: 'lab_supervisor', department: 'Lab Operations', available: true },
  { id: 2, name: 'Ali Mostafa', email: 'ali@ctu.edu.eg', role: 'it_support', department: 'Technical Support', available: false },
  { id: 3, name: 'Omar Khaled', email: 'omar@ctu.edu.eg', role: 'it_support', department: 'Technical Support', available: true },
];

async function fetchUsers() {
  try { return await apiGet('/users/'); }
  catch (e) { if (e instanceof NotImplementedError) return [...mockUsers]; throw e; }
}

export async function render(container) {
  container.innerHTML = '';

  // ── Header ─────────────────────────────────────────────────────────────
  const header = document.createElement('div');
  header.className = 'flex-between mb-3';

  const headerLeft = document.createElement('div');
  const h3 = document.createElement('h3');
  h3.textContent = 'User Management';
  h3.style.marginBottom = '0.25rem';
  const desc = document.createElement('p');
  desc.className = 'text-muted';
  desc.textContent = 'Manage staff accounts and availability';
  headerLeft.appendChild(h3);
  headerLeft.appendChild(desc);
  header.appendChild(headerLeft);

  const addBtn = document.createElement('button');
  addBtn.className = 'btn btn-primary';
  const plusIcon = document.createElement('i');
  plusIcon.className = 'fas fa-plus';
  addBtn.appendChild(plusIcon);
  addBtn.appendChild(document.createTextNode(' Add User'));
  header.appendChild(addBtn);
  container.appendChild(header);

  // ── Search Bar ─────────────────────────────────────────────────────────
  const searchWrap = document.createElement('div');
  searchWrap.className = 'search-bar mb-3';
  const searchIcon = document.createElement('i');
  searchIcon.className = 'fas fa-search';
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search users...';
  searchInput.id = 'user-search';
  searchWrap.appendChild(searchIcon);
  searchWrap.appendChild(searchInput);
  container.appendChild(searchWrap);

  // ── Users Grid ─────────────────────────────────────────────────────────
  const grid = document.createElement('div');
  grid.className = 'students-grid';
  grid.id = 'users-grid';
  container.appendChild(grid);

  let allUsers = [];

  const renderUsers = (users) => {
    grid.innerHTML = '';
    if (users.length === 0) {
      grid.className = 'flex-center';
      grid.appendChild(createEmptyState('fa-users', 'No Users', 'No users match your search.'));
      return;
    }
    grid.className = 'students-grid';
    users.forEach(u => {
      const card = document.createElement('div');
      card.className = 'student-card';

      const img = document.createElement('img');
      img.src = u.avatar || '';
      img.alt = u.name;
      card.appendChild(img);

      const nameH5 = document.createElement('h5');
      nameH5.textContent = u.name;
      card.appendChild(nameH5);

      const roleSpan = document.createElement('span');
      roleSpan.textContent = ROLE_LABELS[u.role] || u.role;
      card.appendChild(roleSpan);

      const dotWrap = document.createElement('div');
      dotWrap.style.cssText = 'margin-top: 0.5rem;';
      const dot = document.createElement('span');
      dot.className = `equip-dot ${u.available ? 'equip-dot--good' : 'equip-dot--maintenance'}`;
      dot.style.cssText = 'display: inline-block; margin-right: 0.25rem;';
      dotWrap.appendChild(dot);
      dotWrap.appendChild(document.createTextNode(u.available ? 'Available' : 'Unavailable'));
      card.appendChild(dotWrap);

      // Click to edit/view
      card.addEventListener('click', () => openUserModal(u));
      card.appendChild(createBadge(u.role === 'lab_supervisor' ? 'Lab' : 'IT', u.role === 'lab_supervisor' ? 'success' : 'primary'));

      grid.appendChild(card);
    });
  };

  const loadUsers = async () => {
    await withSkeleton(grid, 4, (async () => {
      allUsers = await fetchUsers();
      renderUsers(allUsers);
    })());
  };

  // Search filter
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase();
    const filtered = allUsers.filter(u =>
      u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.includes(q)
    );
    renderUsers(filtered);
  });

  // Add/Edit user modal
  function openUserModal(existingUser = null) {
    const isEdit = Boolean(existingUser);
    const form = document.createElement('form');

    const fields = [
      { id: 'user-name', label: 'Full Name', type: 'text', value: existingUser?.name || '' },
      { id: 'user-email', label: 'Email', type: 'email', value: existingUser?.email || '' },
      { id: 'user-dept', label: 'Department', type: 'text', value: existingUser?.department || '' },
    ];

    fields.forEach(f => {
      const group = document.createElement('div');
      group.className = 'form-group';
      group.style.marginBottom = '1rem';
      const label = document.createElement('label');
      label.className = 'form-label';
      label.textContent = f.label;
      const input = document.createElement('input');
      input.type = f.type;
      input.className = 'form-input';
      input.id = f.id;
      input.value = f.value;
      input.required = true;
      group.appendChild(label);
      group.appendChild(input);
      form.appendChild(group);
    });

    // Role select
    const roleGroup = document.createElement('div');
    roleGroup.className = 'form-group';
    roleGroup.style.marginBottom = '1rem';
    const roleLabel = document.createElement('label');
    roleLabel.className = 'form-label';
    roleLabel.textContent = 'Role';
    const roleSelect = document.createElement('select');
    roleSelect.className = 'form-select';
    roleSelect.id = 'user-role';
    ['lab_supervisor', 'it_support'].forEach(v => {
      const opt = document.createElement('option');
      opt.value = v;
      opt.textContent = ROLE_LABELS[v];
      if (existingUser?.role === v) opt.selected = true;
      roleSelect.appendChild(opt);
    });
    roleGroup.appendChild(roleLabel);
    roleGroup.appendChild(roleSelect);
    form.appendChild(roleGroup);

    // Buttons
    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'margin-top: 1.5rem; display: flex; justify-content: space-between;';

    if (isEdit) {
      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'btn btn-danger';
      delBtn.textContent = 'Delete';
      delBtn.addEventListener('click', async () => {
        try {
          await apiDelete(`/users/${existingUser.id}/`);
        } catch (e) {
          if (!(e instanceof NotImplementedError)) { showToast('error', 'Delete failed'); return; }
          mockUsers = mockUsers.filter(u => u.id !== existingUser.id);
        }
        closeModal();
        showToast('info', 'User deleted');
        loadUsers();
      });
      btnRow.appendChild(delBtn);
    } else {
      btnRow.appendChild(document.createElement('div'));
    }

    const rightBtns = document.createElement('div');
    rightBtns.style.cssText = 'display: flex; gap: 0.5rem;';
    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'btn btn-ghost';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', closeModal);
    const saveBtn = document.createElement('button');
    saveBtn.type = 'submit';
    saveBtn.className = 'btn btn-primary';
    saveBtn.textContent = isEdit ? 'Save' : 'Add User';
    rightBtns.appendChild(cancelBtn);
    rightBtns.appendChild(saveBtn);
    btnRow.appendChild(rightBtns);
    form.appendChild(btnRow);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = {
        name: form.querySelector('#user-name').value,
        email: form.querySelector('#user-email').value,
        department: form.querySelector('#user-dept').value,
        role: form.querySelector('#user-role').value,
      };
      try {
        if (isEdit) {
          await apiPatch(`/users/${existingUser.id}/`, data);
        } else {
          await apiPost('/users/', data);
        }
      } catch (e) {
        if (!(e instanceof NotImplementedError)) { showToast('error', 'Operation failed'); return; }
        if (isEdit) {
          Object.assign(mockUsers.find(u => u.id === existingUser.id) || {}, data);
        } else {
          mockUsers.push({ id: Date.now(), available: true, ...data });
        }
      }
      closeModal();
      showToast('success', isEdit ? 'User updated' : 'User added');
      loadUsers();
    });

    openModal(form, isEdit ? 'Edit User' : 'Add New User');
  }

  addBtn.addEventListener('click', () => openUserModal());

  await loadUsers();

  return () => {};
}
