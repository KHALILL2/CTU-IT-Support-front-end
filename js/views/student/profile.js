import { getUser } from '../../utils/jwt.js';
import { showToast } from '../../components/toast.js';

export async function render(container) {
  const user = getUser();
  
  // Safe default for localization fallback
  const getName = (u) => window.getLocalized ? window.getLocalized(u, 'name') : u.name;
  const getDept = (u) => window.getLocalized ? window.getLocalized(u, 'department') : (u.department || '');
  const getYear = (u) => window.getLocalized ? window.getLocalized(u, 'year') : (u.year || '');

  container.innerHTML = `
    <div class="profile-header reveal">
      <div class="profile-avatar">
        <img src="${user.image || ''}" alt="Avatar" id="profile-img">
        <label class="profile-avatar-edit" for="avatar-upload">
          <i class="fas fa-camera"></i>
        </label>
        <input type="file" id="avatar-upload" accept="image/*" style="display:none">
      </div>
      <h3 id="profile-display-name">${getName(user)}</h3>
      <span class="badge badge-progress" id="profile-display-dept">${getDept(user)}</span>
    </div>

    <div class="card" style="padding: 2rem; margin-top: 2rem;">
      <form id="profile-form" class="profile-form" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
        <div class="form-group">
          <label class="form-label" data-i18n="profile.name">Full Name</label>
          <input type="text" class="form-input" id="pf-name" value="${getName(user)}">
        </div>
        <div class="form-group">
          <label class="form-label" data-i18n="profile.dept">Department</label>
          <input type="text" class="form-input" id="pf-dept" value="${getDept(user)}">
        </div>
        <div class="form-group">
          <label class="form-label" data-i18n="profile.year">Academic Year</label>
          <input type="text" class="form-input" id="pf-year" value="${getYear(user)}">
        </div>
        <div class="form-group">
          <label class="form-label" data-i18n="profile.phone">Phone Number</label>
          <input type="tel" class="form-input" id="pf-phone" value="${user.phone || ''}">
        </div>
        <div class="form-group">
          <label class="form-label" data-i18n="profile.id">Academic ID</label>
          <input type="text" class="form-input" id="pf-id" value="${user.academicId || user.academic_id || ''}" readonly style="opacity:0.7;cursor:not-allowed">
        </div>
        <div class="form-group">
          <label class="form-label" data-i18n="profile.email">Email Address</label>
          <input type="email" class="form-input" id="pf-email" value="${user.email || ''}">
        </div>
        <div style="grid-column: 1 / -1; margin-top: 0.5rem">
          <button type="submit" class="btn btn-primary btn-lg ripple" data-i18n="profile.update">
            <i class="fas fa-save"></i> Update Data
          </button>
        </div>
      </form>
    </div>
  `;

  // Avatar upload preview
  const uploadInput = container.querySelector('#avatar-upload');
  uploadInput?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        container.querySelector('#profile-img').src = ev.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // Form submit
  const form = container.querySelector('#profile-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('success', window.t ? window.t('profile.updated') : 'Profile updated successfully.');
    
    // Optimistic UI updates to header
    container.querySelector('#profile-display-name').textContent = container.querySelector('#pf-name').value;
    container.querySelector('#profile-display-dept').textContent = container.querySelector('#pf-dept').value;
  });
}
