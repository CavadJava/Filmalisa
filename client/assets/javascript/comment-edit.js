const input = document.getElementById('comment-input');
const sendBtn = document.getElementById('send-btn');
const commentsContainer = document.getElementById('comments-container');

sendBtn.addEventListener('click', () => {
    const text = input.value.trim();
    if(!text) return;

    // Yeni comment elementi yarat
    const commentBox = document.createElement('div');
    commentBox.className = 'comment-box d-flex mb-3';
    commentBox.style.width = '682px';
    commentBox.style.height = '167px';
    commentBox.innerHTML = `
        <img src="../assets/images/detail/Group-82.svg" class="avatar" alt="avatar">
        <div>
            <div class="d-flex justify-content-between align-items-center">
                <h6 class="mb-1">You</h6>
                <span class="time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} today</span>
            </div>
            <p class="mb-0 text-light">${text}</p>
        </div>
    `;
    
    // Comment container-ə əlavə et
    commentsContainer.prepend(commentBox);

    // Inputu təmizlə
    input.value = '';
});