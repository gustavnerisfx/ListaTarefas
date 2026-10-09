const pad = (n) => String(n).padStart(2, '0');

export const formatDate = (ts) => {
  const d = new Date(ts);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

export const formatTime = (ts) => {
  const d = new Date(ts);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const formatDateTime = (ts) => `${formatDate(ts)} às ${formatTime(ts)}`;

/**
 * Uma tarefa está vencida quando NÃO foi concluída,
 * tem data/hora de vencimento e esse momento já passou.
 * O status nunca é salvo: é sempre calculado a partir do "agora".
 */
export const isOverdue = (task, now) =>
  !task.done && task.dueAt != null && task.dueAt < now;

/** "Vence em 3 h", "Venceu há 12 min", etc. */
export function relativeDue(dueAt, now) {
  const diff = dueAt - now;
  const minutes = Math.floor(Math.abs(diff) / 60000);
  if (minutes < 1) return 'Vence agora';

  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  let text;
  if (minutes < 60) text = `${minutes} min`;
  else if (hours < 24) text = `${hours} h`;
  else text = `${days} ${days === 1 ? 'dia' : 'dias'}`;

  return diff < 0 ? `Venceu há ${text}` : `Vence em ${text}`;
}

/** Troca só o dia, mantendo a hora já escolhida (ou 23:59 se ainda não houver). */
export function mergeDate(dueAt, date) {
  const base = dueAt != null ? new Date(dueAt) : null;
  const hours = base ? base.getHours() : 23;
  const minutes = base ? base.getMinutes() : 59;
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours,
    minutes
  ).getTime();
}

/** Troca só a hora, mantendo o dia já escolhido (ou hoje se ainda não houver). */
export function mergeTime(dueAt, hours, minutes) {
  const base = dueAt != null ? new Date(dueAt) : new Date();
  return new Date(
    base.getFullYear(),
    base.getMonth(),
    base.getDate(),
    hours,
    minutes
  ).getTime();
}

/** Vencidas primeiro, depois as mais próximas do prazo, depois as sem data. */
export function sortPending(list, now) {
  return [...list].sort((a, b) => {
    const aOver = isOverdue(a, now);
    const bOver = isOverdue(b, now);
    if (aOver !== bOver) return aOver ? -1 : 1;
    if (a.dueAt != null && b.dueAt != null) return a.dueAt - b.dueAt;
    if (a.dueAt != null) return -1;
    if (b.dueAt != null) return 1;
    return b.createdAt - a.createdAt;
  });
}

/** Concluídas mais recentes primeiro. */
export const sortDone = (list) =>
  [...list].sort((a, b) => (b.doneAt ?? 0) - (a.doneAt ?? 0));
