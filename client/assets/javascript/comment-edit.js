console.log("Comment edit started");

// global variables
const request = new URLSearchParams(window.location.search)
let profileData = [];
// API BASE URL
const COMMENTS_BASE_URL = "https://api.sarkhanrahimli.dev/api/filmalisa";
const GET_PROFILE = `${COMMENTS_BASE_URL}/profile`;
const LIST_COMMENT = `${COMMENTS_BASE_URL}/movies/${request.get('id')}/comments`;
console.log(LIST_COMMENT)

const input = document.getElementById('comment-input');
const sendBtn = document.getElementById('send-btn');

// const text = input.value.trim();
// if (!text) return;

// Load Comments
handlerComments();

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
async function loadProfile(){
    try {
        fetch(`${GET_PROFILE}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(response => response.json())
    }catch (error){
        console.error("Error loading movie:", error);
    }
}

function displayData(data) {
    const commentsContainer = document.getElementById('comments-container');

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
        commentsContainer.innerHTML+=row;
    });

    // Inputu təmizlə
    input.value = '';
}
function getCommentDate(data){
    const createdAt = new Date(data.created_at);
    const date = new Date();

    const options = {
        day: '2-digit',      // DD (e.g., 05)
        month: 'short',      // MMM (e.g., Oct)
        year: 'numeric',     // YYYY (e.g., 2025)
        hour: 'numeric',     // hour (e.g., 5 or 17)
        minute: '2-digit',   // minutes (e.g., 02)
        hour12: false        // Use 24-hour format
    };

    const formatter = new Intl.DateTimeFormat('en-US', options);

    return formatter.format(date);
}