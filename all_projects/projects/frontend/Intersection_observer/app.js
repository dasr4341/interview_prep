const cardContainer = document.querySelector('.card-container');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        entry.target.classList.toggle('show', entry.isIntersecting)
        // we can unobserve by ---
        if (entry.isIntersecting) {
            observer.unobserve(entry.target);
        }
    })
}, {
    // rootMargin: '-100px',
    threshold: '1' // range -> 0 - 1 
})

document.querySelectorAll('.card').forEach(card => {
    observer.observe(card)
})

// now we will add a feature -
// On end reach we will call api, resulting an infinite scroll

function callApi() {
    for (let index = 0; index < 10; index++) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = 'This is a New card - ' + index
        observer.observe(card);
        cardContainer.appendChild(card);
    }
}

const lastElementObserver = new IntersectionObserver(entries => {
    const lastCard = entries[0];
    if (!lastCard.isIntersecting) return;
    callApi();
    lastElementObserver.unobserve(lastCard.target);
    lastElementObserver.observe(document.querySelector('.card:last-child'));
})

lastElementObserver.observe(document.querySelector('.card:last-child'));