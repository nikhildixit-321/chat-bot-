const API_KEY = 'AIzaSyAyQgn1U-CbclHps-kaBq8rh8w0yfqAk7M'
const API_URL ='https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
const chatMessage = document.getElementById('chat-message')
const userInput= document.getElementById('user-input')

const sendButton = document.getElementById('send-button');


async function generateResponse(prompt) {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        { text: prompt }  // fixed typo: `test` → `text`
                    ]
                }
            ]
        })
    });

    if (!response.ok) {
        throw new Error('Failed to give response');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}
function clearMarkdown(text){
    return text
    .replace(/#{1,6}\s?/g,'')
    .replace(/\*\*/g,'')
    .replace(/\n{3,}/g,'\n\n')
    .trim();
}

 function addMessage(message,isuser){
    const messageElement = document.createElement('div')
    messageElement.classList.add('message')
    messageElement.classList.add(isuser?'user-message':'bot-message')
    const profileImage = document.createElement('img')
    profileImage.classList.add('profile-image')
    profileImage.src = isuser?'user.png':'bot.avif'
    profileImage.alt = isuser?'user': 'bot'
    const messageContent = document.createElement('div')
    messageContent.classList.add('message-content')
    messageContent.textContent = message
    messageElement.appendChild(profileImage)
    messageElement.appendChild(messageContent)
    chatMessage.appendChild(messageElement)
    chatMessage.scrollTop = chatMessage.scrollHeight
 }

 async function handleUserInput() {
    const userMessage = userInput.value.trim();
    if(userMessage){
        addMessage(userMessage,true)
        userInput.value= ''
        sendButton.disabled = true;

        userInput.disabled = true

    }
    try {
        const botMessage = await generateResponse(userMessage)
        addMessage(clearMarkdown(botMessage),false)
    } catch (error) {
        console.error(error)
        addMessage('sorry i am unable to give response, please try later')

    }
    finally{
        sendButton.disabled = false
        userInput.disabled = false
        userInput.focus()
    }
    
 }
 sendButton.addEventListener('click',handleUserInput)
