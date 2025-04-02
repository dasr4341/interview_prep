// This file is for execution, invoking func, business logic

window.addEventListener('scroll', setScrollVar)
window.addEventListener('resize', setScrollVar)

setScrollVar();

const observer = new IntersectionObserver(entries => {
    console.log(entries);
    for (let i = entries.length - 1; i >= 0; i--) {
      const entry = entries[i]
      if (entry.isIntersecting) {
        document.querySelectorAll("[data-img]").forEach(img => {
          img.classList.remove("show")
        })
        const img = document.querySelector(entry.target.dataset.imgToShow)
        img?.classList.add("show")
        break
      }
    }
  })

document.querySelectorAll("[data-img-to-show]").forEach(section => {
    observer.observe(section)
  })