const chat = document.getElementById('chat');
const userInput = document.getElementById('user-input');
let conversation = [];


userInput.addEventListener('keypress', handleKeyPress);

function handleKeyPress(event) {
    if (event.keyCode === 13) {
    event.preventDefault();
    sendMessage();
    }
}

function createMessage(role, content) {
    const message = document.createElement('div');
    message.className = 'message ' + role + '-message';
    message.textContent = content;
    return message;
}

function displayMessage(role, content) {
    const message = createMessage(role, content);
    chat.appendChild(message);
    chat.scrollTop = chat.scrollHeight;
}


function sendMessage() {
    var message = userInput.value;
    userInput.value = "";

    const userMessage = createMessage('user', message);
    chat.appendChild(userMessage);
    chat.scrollTop = chat.scrollHeight;

    // Display typing dots
    const typingDots = createMessage('bot', '...');
    chat.appendChild(typingDots);
    chat.scrollTop = chat.scrollHeight;

    var count = 0;
    var intervalId = setInterval(function() {
        if (count % 3 === 0) {
            typingDots.textContent = ".";
        } else if (count % 3 === 1) {
            typingDots.textContent = "..";
        } else {
            typingDots.textContent = "...";
        }
        count++;
    }, 600);


    // Generate a unique user ID or retrieve an existing one
    var userId = window.sessionStorage.getItem('userId');
    if (!userId) {
        userId = Math.random().toString(36).substr(2, 9);
        window.sessionStorage.setItem('userId', userId);
    }

    // Send the user message and ID to the server
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);

            // Remove typing dots and display bot's response
            clearInterval(intervalId);
            typingDots.remove();
            displayMessage('bot', response.answer);
        }
    };
    xmlhttp.open("POST", "/chat", true);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify({ user_id: userId, user_input: message }));
}


let firstTimeOpening = true;
function toggleChat() {
    var chat = document.getElementById("chat");
    var chatbox = document.querySelector(".container");
    var minimize = document.getElementById("minimized-chat");
    //opening it
    if (chatbox.style.display === "none") {
        chatbox.style.display = "flex";
        minimize.style.display = "none";
        if (firstTimeOpening) {
            firstTimeOpening = false;
            displayMessage('bot', 'Welcome to our experimental AI chatbot! Our assistant is here to aid you with any photography-related questions you may have. As an experimental system, our chatbot may occasionally generate incorrect information, but we are continually working to improve its accuracy. Please feel free to ask us anything!');
        }
    } else {//closing it
        chatbox.style.display = "none";
        minimize.style.display = "flex";
    }
    chat.scrollTop = chat.scrollHeight;
    document.getElementById("user-input").focus();
}
