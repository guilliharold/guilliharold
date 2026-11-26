document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();

  // Career history: only one role open at a time
  const jobs = Array.from(document.querySelectorAll("details.job"));
  jobs.forEach((job) => {
    job.querySelector("summary").addEventListener("click", () => {
      jobs.forEach((other) => {
        if (other !== job) other.open = false;
      });
    });
  });

  // Print / Save as PDF: expand every role, then restore
  let before = [];
  window.addEventListener("beforeprint", () => {
    before = jobs.map((d) => d.open);
    jobs.forEach((d) => (d.open = true));
  });
  window.addEventListener("afterprint", () => {
    jobs.forEach((d, i) => (d.open = before[i]));
  });
});