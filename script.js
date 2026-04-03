let currentUser = localStorage.getItem('wedding_user_name');

if (!currentUser) {
    currentUser = prompt("Добро пожаловать! Как вас зовут?");
    if (!currentUser || currentUser.trim() === "") currentUser = "Гость";
    localStorage.setItem('wedding_user_name', currentUser);
}

const admins = ["Макар", "Зая"];
const isAdmin = admins.includes(currentUser);
document.getElementById('user-display-name').innerText = currentUser;

const fileInput = document.getElementById('file-upload');
const gallery = document.querySelector('.gallery');

fileInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const card = document.createElement('div');
            card.className = 'card';
            card.setAttribute('data-owner', currentUser);

            let mediaHtml = file.type.startsWith('video') 
                ? `<video src="${e.target.result}" class="post-video" controls loop muted playsinline></video>`
                : `<img src="${e.target.result}" class="post-img">`;

            const deleteBtn = isAdmin ? `<button class="del-btn">×</button>` : '<span></span>';

            card.innerHTML = `
                <div class="post-header">
                    <div style="display:flex; align-items:center;">
                        <div class="avatar">${currentUser[0].toUpperCase()}</div>
                        <span class="username">${currentUser}</span>
                    </div>
                    ${deleteBtn}
                </div>
                ${mediaHtml}
                <div class="post-footer">
                    <div class="actions">
                        <span class="like" style="cursor:pointer; font-size:24px; color:#bca085;">♡</span>
                        <a href="${e.target.result}" download="Wedding_04_04" style="text-decoration:none; font-size:22px;">💾</a>
                    </div>
                    <p style="font-size:14px;"><strong>${currentUser}</strong> <span contenteditable="true" class="caption-text">Напишите пожелание...</span></p>
                </div>
            `;

            card.querySelector('.like').onclick = function() {
                if (this.innerText === '♡') { this.innerText = '❤️'; this.style.color = '#ed4956'; }
                else { this.innerText = '♡'; this.style.color = '#bca085'; }
            };

            if (isAdmin) {
                card.querySelector('.del-btn').onclick = () => { if(confirm("Удалить?")) card.remove(); };
            }
            gallery.prepend(card);
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('show-all').onclick = () => {
    document.getElementById('show-all').classList.add('active');
    document.getElementById('show-mine').classList.remove('active');
    document.querySelectorAll('.card').forEach(c => c.style.display = 'block');
};

document.getElementById('show-mine').onclick = () => {
    document.getElementById('show-mine').classList.add('active');
    document.getElementById('show-all').classList.remove('active');
    document.querySelectorAll('.card').forEach(c => {
        c.style.display = (c.getAttribute('data-owner') === currentUser) ? 'block' : 'none';
    });
};