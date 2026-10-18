const courses = [
  {
    id: "fundamentos",
    category: "FUNDAMENTOS",
    title: "Fundamentos digitais",
    description:
      "Organize ideias, ferramentas e rotinas para trabalhar com mais clareza.",
    lessons: [
      "Primeiros passos",
      "Sua rotina digital",
      "Organizando prioridades",
    ],
    tone: "blue",
  },
  {
    id: "planejamento",
    category: "PLANEJAMENTO",
    title: "Projetos com propósito",
    description:
      "Transforme objetivos em etapas simples, mensuráveis e fáceis de acompanhar.",
    lessons: [
      "Definindo objetivos",
      "Construindo um plano",
      "Acompanhando resultados",
    ],
    tone: "violet",
  },
  {
    id: "comunicacao",
    category: "COMUNICAÇÃO",
    title: "Comunicação clara",
    description:
      "Crie mensagens úteis e experiências digitais que respeitam o tempo das pessoas.",
    lessons: [
      "Conhecendo o público",
      "Escrevendo com clareza",
      "Revisão e melhoria",
    ],
    tone: "peach",
  },
];
const storageKey = "horizonte-academy-demo-progress-v1";
let completed = readProgress();
let activeCourse = courses[0];
let activeLessonIndex = 0;

function readProgress() {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return new Set(
      Array.isArray(value)
        ? value.filter((item) => typeof item === "string")
        : [],
    );
  } catch {
    return new Set();
  }
}
function saveProgress() {
  try {
    localStorage.setItem(storageKey, JSON.stringify([...completed]));
  } catch {
    /* Demo remains usable without storage. */
  }
}
function lessonKey(course, index) {
  return `${course.id}:${index}`;
}
function percent(course) {
  return Math.round(
    (course.lessons.filter((_, index) =>
      completed.has(lessonKey(course, index)),
    ).length /
      course.lessons.length) *
      100,
  );
}
function courseCard(course) {
  const article = document.createElement("article");
  article.className = "course-card";
  article.innerHTML = `<div class="course-art ${course.tone}" aria-hidden="true"><span>${course.category}</span><span class="art-symbol">✦</span></div><div class="course-body"><p class="course-category">${course.category}</p><h3>${course.title}</h3><p>${course.description}</p><div class="course-meta"><span>${course.lessons.length} aulas</span><strong>${percent(course)}% concluído</strong></div><div class="progress-track" role="progressbar" aria-label="Progresso de ${course.title}" aria-valuenow="${percent(course)}" aria-valuemin="0" aria-valuemax="100"><span style="width:${percent(course)}%"></span></div><button class="course-open" type="button">Abrir curso <span aria-hidden="true">→</span></button></div>`;
  article
    .querySelector("button")
    .addEventListener("click", () => openLesson(course, 0));
  return article;
}
function renderCards(search = "") {
  const matches = courses.filter((course) =>
    `${course.title} ${course.description} ${course.lessons.join(" ")}`
      .toLocaleLowerCase("pt-BR")
      .includes(search.toLocaleLowerCase("pt-BR")),
  );
  for (const [id, list] of [
    ["featured-courses", courses.slice(0, 2)],
    ["all-courses", matches],
  ]) {
    const root = document.getElementById(id);
    root.replaceChildren(...list.map(courseCard));
  }
  document
    .getElementById("search-empty")
    .classList.toggle("hidden", matches.length !== 0);
}
function renderProgress() {
  const root = document.getElementById("progress-list");
  root.replaceChildren();
  courses.forEach((course) => {
    const row = document.createElement("div");
    row.className = "progress-row";
    row.innerHTML = `<div><strong>${course.title}</strong><span>${percent(course)}% concluído</span></div><div class="progress-track" role="progressbar" aria-label="Progresso de ${course.title}" aria-valuenow="${percent(course)}" aria-valuemin="0" aria-valuemax="100"><span style="width:${percent(course)}%"></span></div>`;
    root.append(row);
  });
}
const viewNames = {
  overview: [
    "Visão geral",
    "Sua jornada continua aqui.",
    "Escolha uma aula, acompanhe seu progresso e continue de onde parou.",
  ],
  library: [
    "Meus cursos",
    "Aprenda no seu ritmo.",
    "Explore conteúdos de demonstração organizados por curso.",
  ],
  progress: [
    "Meu progresso",
    "Veja o quanto você avançou.",
    "Suas aulas concluídas aparecem aqui e ficam salvas apenas neste navegador.",
  ],
  lesson: ["Aula", "Continue aprendendo.", "Navegue pelas aulas deste curso."],
};
function showView(view, focus = true) {
  document
    .querySelectorAll(".view")
    .forEach((section) =>
      section.classList.toggle("hidden", section.id !== `${view}-view`),
    );
  document
    .querySelectorAll(".nav-item")
    .forEach((button) =>
      button.classList.toggle("active", button.dataset.view === view),
    );
  const [name, title, subtitle] = viewNames[view];
  document.getElementById("view-name").textContent = name;
  document.getElementById("page-title").textContent = title;
  document.getElementById("page-subtitle").textContent = subtitle;
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("menu-button").setAttribute("aria-expanded", "false");
  renderCards(document.getElementById("course-search").value);
  renderProgress();
  if (focus) document.getElementById("main").focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function openLesson(course, index) {
  activeCourse = course;
  activeLessonIndex = index;
  showView("lesson");
  document.getElementById("lesson-category").textContent = course.category;
  document.getElementById("lesson-title").textContent = course.lessons[index];
  document.getElementById("lesson-description").textContent =
    `Aula ${index + 1} de ${course.lessons.length} do curso ${course.title}. Esta tela demonstra uma estrutura de aprendizagem; não há vídeo ou conteúdo pago neste repositório.`;
  const completeButton = document.getElementById("complete-lesson");
  completeButton.textContent = completed.has(lessonKey(course, index))
    ? "Aula concluída ✓"
    : "Marcar aula como concluída";
  completeButton.disabled = completed.has(lessonKey(course, index));
  const list = document.getElementById("lesson-list");
  list.replaceChildren();
  course.lessons.forEach((lesson, lessonIndex) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `lesson-item${lessonIndex === index ? " selected" : ""}`;
    button.textContent = `${String(lessonIndex + 1).padStart(2, "0")}  ${lesson}${completed.has(lessonKey(course, lessonIndex)) ? "  ✓" : ""}`;
    button.addEventListener("click", () => openLesson(course, lessonIndex));
    list.append(button);
  });
}
document
  .querySelectorAll("[data-view]")
  .forEach((button) =>
    button.addEventListener("click", () => showView(button.dataset.view)),
  );
document
  .getElementById("course-search")
  .addEventListener("input", (event) => renderCards(event.target.value));
document.getElementById("complete-lesson").addEventListener("click", () => {
  completed.add(lessonKey(activeCourse, activeLessonIndex));
  saveProgress();
  openLesson(activeCourse, activeLessonIndex);
});
document.getElementById("reset-progress").addEventListener("click", () => {
  completed = new Set();
  saveProgress();
  renderProgress();
  renderCards();
});
document.getElementById("menu-button").addEventListener("click", (event) => {
  const expanded = event.currentTarget.getAttribute("aria-expanded") === "true";
  event.currentTarget.setAttribute("aria-expanded", String(!expanded));
  document.getElementById("sidebar").classList.toggle("open", !expanded);
});
showView("overview", false);
