console.log("Comment edit started");

// global variables
const request = new URLSearchParams(window.location.search)
let profileData = [];
// API BASE URL
const COMMENTS_BASE_URL = "https://api.sarkhanrahimli.dev/api/filmalisa";
const LIST_COMMENT = `${COMMENTS_BASE_URL}/movies/${request.get('id')}/comments`;
const POST_COMMENT = `${COMMENTS_BASE_URL}/movies/${request.get('id')}/comment`;
console.log(LIST_COMMENT)

const input = document.getElementById('comment-input');
const sendBtn = document.getElementById('send-btn');

// Load Comments
handlerComments();

//Load and Post Comment
sendBtn.addEventListener("click", handlerPostComment);

// Handler Comments
function handlerComments(){
    fetch(LIST_COMMENT, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    })
    .then(response => response.json())
    .then(resp => {
        console.log("Comments loaded:", resp);
        displayData(resp.data);
    })
    .catch(error => {
        console.error("Error loading comments:", error);
    });
}
function handlerPostComment(){
    // Check if input is empty
    if (!input.value.trim()) {
        alert("Zəhmət olmasa şərh yazın!");
        return;
    }

    const body = {
        "comment": input.value.trim()
    };
    fetch(POST_COMMENT, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(resp => {
        console.log("Comment posted:", resp);
        // Clear input after successful post
        input.value = '';
        // Reload comments
        handlerComments();
    })
    .catch(error => {
        console.error("Error posting comment:", error);
        alert("Şərh göndərilərkən xəta baş verdi!");
    });
}

function displayData(data) {
    const commentsContainer = document.getElementById('comments-container');

    // Clear container before adding new comments to avoid duplicates
    commentsContainer.innerHTML = '';

    // Check if there are any comments
    if (!data || data.length === 0) {
        commentsContainer.innerHTML = '<p class="text-light text-center">Hələ ki şərh yoxdur. İlk şərhi siz yazın!</p>';
        return;
    }

    data.forEach(comment => {
        let lastDate = getCommentDate(comment);
        let row = `
            <div class="comment-box d-flex" style="width: 682px; height: 167px;">
                <img src="${comment.user['img_url']}" class="avatar" alt="avatar">
                <div>
                    <div class="d-flex justify-content-between gap-3">
                        <h6 class="mb-2">${comment.user.full_name}</h6>
                        <span class="time">${lastDate}</span>
                    </div>
                    <p class="mb-0 text-light">${comment.comment}</p>
                </div>
            </div>
            `;
        commentsContainer.innerHTML += row;
    });
}
function getCommentDate(data){
    const createdAt = new Date(data.created_at);

    const options = {
        day: '2-digit',      // DD (e.g., 05)
        month: 'short',      // MMM (e.g., Oct)
        year: 'numeric',     // YYYY (e.g., 2025)
        hour: 'numeric',     // hour (e.g., 5 or 17)
        minute: '2-digit',   // minutes (e.g., 02)
        hour12: false        // Use 24-hour format
    };

    const formatter = new Intl.DateTimeFormat('en-US', options);

    // Use createdAt instead of current date
    return formatter.format(createdAt);
}