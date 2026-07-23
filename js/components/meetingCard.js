import { createBadge } from './badge.js';

/**
 * Creates a meeting card element.
 * @param {Object} meeting - The meeting data.
 * @param {'admin'|'student'} context - The context rendering the card.
 * @param {Object} actions - Handlers: onStart, onEnd, onJoin, onDelete.
 * @returns {HTMLElement}
 */
export function createMeetingCard(meeting, context, actions = {}) {
  const card = document.createElement('div');
  card.className = 'feature-card';
  card.style.padding = '1.5rem';
  
  const header = document.createElement('div');
  header.className = 'flex-between';
  header.style.marginBottom = '1rem';
  
  const title = document.createElement('h3');
  title.textContent = meeting.title;
  title.style.margin = '0';
  header.appendChild(title);
  
  if (meeting.status === 'active') {
    header.appendChild(createBadge('LIVE', 'danger'));
  } else {
    header.appendChild(createBadge('Scheduled', 'pending'));
  }
  card.appendChild(header);
  
  const desc = document.createElement('p');
  desc.textContent = meeting.desc;
  desc.style.marginBottom = '1.5rem';
  card.appendChild(desc);
  
  const btnGroup = document.createElement('div');
  btnGroup.className = 'flex gap-2';
  
  if (context === 'admin') {
    if (meeting.status === 'scheduled') {
      const startBtn = document.createElement('button');
      startBtn.className = 'btn btn-primary';
      startBtn.textContent = 'Start';
      startBtn.onclick = () => actions.onStart && actions.onStart(meeting.id);
      btnGroup.appendChild(startBtn);
    } else if (meeting.status === 'active') {
      const endBtn = document.createElement('button');
      endBtn.className = 'btn btn-danger';
      endBtn.textContent = 'End';
      endBtn.onclick = () => actions.onEnd && actions.onEnd(meeting.id);
      btnGroup.appendChild(endBtn);
    }
    const delBtn = document.createElement('button');
    delBtn.className = 'btn btn-ghost';
    delBtn.textContent = 'Delete';
    delBtn.onclick = () => actions.onDelete && actions.onDelete(meeting.id);
    btnGroup.appendChild(delBtn);
  } else if (context === 'student') {
    if (meeting.status === 'active') {
      const joinBtn = document.createElement('a');
      joinBtn.className = 'btn btn-primary';
      joinBtn.textContent = 'Join Meeting';
      joinBtn.href = meeting.link || '#';
      joinBtn.target = '_blank';
      btnGroup.appendChild(joinBtn);
    } else {
      const waitMsg = document.createElement('span');
      waitMsg.className = 'text-muted';
      waitMsg.textContent = `Starts at ${meeting.time}`;
      btnGroup.appendChild(waitMsg);
    }
  }
  
  card.appendChild(btnGroup);
  return card;
}
