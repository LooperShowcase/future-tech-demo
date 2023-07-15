let open_ai_response;

let conversation = [
  { role: "system", content: "You are really kind." }
];

async function conversationUserAdd(question, sentiment) {
  conversation.push({role: "user", content: "My Happiness out of 10: " + (sentiment) + " . " + "My input is: " + question});
}

async function conversationAssistantAdd(response) {
  conversation.push({role: "assistant", content: response});
}

async function conversationFunctionAdd(call) {
  conversation.push({role: "function", content: call});
}

async function get_current_weather() {
  //this function can do whatever we want it to do
}

async function openai_test() {
  var url = "https://api.openai.com/v1/chat/completions";
  var apikey1 = "sk-jewzlrJimdKCWoNC";
  var apikey2 = "x6CUT3BlbkFJ7rh";
  var apikey3 = "AWckdyi3eQRL4AA4w";
  var apiKey = apikey1 + apikey2 + apikey3;

let functions = [
        {
            "name": "get_current_weather",
            "description": "Get the current weather in a given location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g. San Francisco, CA",
                    },
                    "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
                },
                "required": ["location"],
            },
        }
];

  var data = {
    model: "gpt-3.5-turbo",
    messages: conversation,
	  functions: functions
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const responseData = await response.json();
      const message = responseData.choices[0].message.content;
      console.log(responseData);

      try {
        let functionCall = responseData["choices"][0]["message"]["function_call"]["name"];
        conversationAssistantAdd("function call")
        get_current_weather();
      }
      catch {
        console.log(message);

        conversationAssistantAdd(message);

        const utterance = new SpeechSynthesisUtterance(message);
        speechSynthesis.speak(utterance);
        return message;
      }
    } else {
      console.log("Request failed with status:", response.status);
    }
  } catch (error) {
    console.log("An error occurred:", error);
  }
}
