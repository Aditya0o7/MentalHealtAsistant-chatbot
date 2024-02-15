// Function to simulate a delay
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to create a typing effect
async function typeWriter(text, container) {
  for (let i = 0; i < text.length; i++) {
    container.innerHTML += text.charAt(i);
    await sleep(12); // Adjust the delay (in milliseconds) to control typing speed
  }
}

// document.getElementById("submitbtn").addEventListener('click', function () {
//   const uName = document.getElementsByClassName('namebox')[0].value;
//   window.location.href = '/?uName=' + encodeURIComponent(uName);
//   document.getElementById("front-div").style.left = "-1380px";
//   document.getElementById("side-div").style.left = "0px"; 
// });

document.getElementById("submitbtn").addEventListener('click', function () {
  const uName = document.getElementsByClassName('namebox')[0].value;
  document.getElementById("front-div").style.left = "-1380px";
  document.getElementById("side-div").style.left = "0px";
  document.body.style.overflowY = "hidden" ;
  // Perform other client-side operations here
  // Send uName to the server using AJAX
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/?uName=' + encodeURIComponent(uName));
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function () {
      if (xhr.status === 200) {
          console.log('Server response:', xhr.responseText);
          // Handle successful response from the server
      } else {
          console.error('Request failed. Status:', xhr.status);
          // Handle error response from the server
      }
  };
  xhr.send();
});
document.getElementById("home").addEventListener('click',()=>{
  document.getElementById("front-div").style.left = "0px";
  document.getElementById("side-div").style.left = "1650px";
  document.body.style.overflowY = "visible" ;
});

// Function to create a chat bubble and append it to the chat history
// Function to create a chat bubble and append it to the chat history
async function appendChatBubble(role, text) {
  const chatHistory = document.getElementById('chatbox');  // Corrected ID
  // Create a new chat bubble element
  const chatBubble = document.createElement('div');
  chatBubble.classList.add('chat', role);

  if (role === 'bot') {
    // Display typing effect for the bot response
    const typingSpan = document.createElement('span');
    typingSpan.classList.add('typing-span');
    typingSpan.classList.add('incoming'); // Add a class for styling if needed
    chatBubble.appendChild(typingSpan);

    chatHistory.appendChild(chatBubble);
    await typeWriter(text, typingSpan);
  } else {
    // Display user message immediately
    
    chatBubble.textContent = text;
    chatBubble.classList.add('outgoing');
    chatHistory.appendChild(chatBubble);
  }
  
}

// Function to handle form submission
function handleSubmit(event) {
  event.preventDefault();

  const inputText = document.getElementById('chat-inp').value;
  if (inputText.trim() === '') {
    return;
  }

  // Display user message in the chat history
  appendChatBubble('user', inputText);

  // Send user input to the server using fetch
  fetch('/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: inputText}),
  })
    .then(response => response.json())
    .then(data => {
      // Get the actual server response from the 'data' object
      const botResponse = data.response;

      // Display bot message with typing effect in the chat history
      appendChatBubble('bot', botResponse);
    })
    .catch(error => {
      console.error('Error:', error);
      // Handle errors as needed
    });

  // Clear the input field
  document.getElementById('chat-inp').value = '';
}

// Attach the handleSubmit function to the form's submit event
document.getElementById('user-input-form').addEventListener('submit', handleSubmit);

