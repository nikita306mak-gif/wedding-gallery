// Настройки Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBkQWaNGF7MISkpUrb67oetzF4O5BYjONQ",
    authDomain: "wedding-gallery02.firebaseapp.com",
    projectId: "wedding-gallery02",
    storageBucket: "wedding-gallery02.firebasestorage.app",
    appId: "1:476761207207:web:ed0a691a3006c8d2780682"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const IMGBB_API_KEY = '26ad743452abb79302957893e27a8817';

const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const gallery = document.getElementById('gallery');

// Функция загрузки
uploadBtn.onclick = async () => {
    const file = fileInput.files[0];
    if (!file) return alert("Выберите фото");

    uploadBtn.disabled = true;
    uploadBtn.innerText = "Загрузка...";

    const formData = new FormData();
    formData.append('image', file);

    const resp = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData
    });
    const result = await resp.json();

    if (result.success) {
        await db.collection('photos').add({
            url: result.data.url,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    }
    
    uploadBtn.disabled = false;
    uploadBtn.innerText = "Загрузить фото";
    fileInput.value = "";
};

// Отображение фото (автоматически обновляет твой старый дизайн)
db.collection('photos').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
    gallery.innerHTML = '';
    snapshot.forEach(doc => {
        const img = document.createElement('img');
        img.src = doc.data().url;
        // Здесь добавь свои классы или стили, если они были в старом варианте
        gallery.appendChild(img);
    });
});