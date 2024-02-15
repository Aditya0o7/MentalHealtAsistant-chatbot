from transformers import GPT2LMHeadModel, GPT2Tokenizer
import torch
import sys
import warnings
warnings.filterwarnings("ignore", category=UserWarning, module="transformers")
warnings.filterwarnings("ignore", category=UserWarning, module="torch")

model = GPT2LMHeadModel.from_pretrained("vitality")
tokenizer = GPT2Tokenizer.from_pretrained("vitality")

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)


model.eval()

def generate_text(prompt, max_length=120, temperature=0.7):
    input_ids = tokenizer.encode(prompt, return_tensors="pt").to(device)
    output_ids = model.generate(
        input_ids,
        max_length=max_length,
        do_sample = True,
        temperature=temperature,
        num_beams=5,
        no_repeat_ngram_size=2,
        top_k=50,
        top_p=0.95,
        pad_token_id=tokenizer.eos_token_id
    )
    response = tokenizer.decode(output_ids[0], skip_special_tokens=True)
    return response

if __name__ == "__main__":
    user_input = sys.argv[1]
    user_name = sys.argv[2]
    response = generate_text(user_input)
    response=response.split("\n")
    response = response[1]
    response = response.replace(["[BOT]", ""])
    response = response.replace("Charlie", user_name)
# response = response.replace("[BOT]", "Vitality: ")
#         response = response.replace("Charlie", user_name)
#         response = response.replace("Alex", user_name)
#         response = response.replace(f"I am {user_name}", "I am Vitality")