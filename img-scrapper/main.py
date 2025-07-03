import tkinter as tk
from tkinter import messagebox, ttk
from PIL import ImageGrab, Image
import os
import uuid
import threading
from google import genai
from google.genai import types
from dotenv import load_dotenv
import json

TEMP_DIR = "temp"
os.makedirs(TEMP_DIR, exist_ok=True)

load_dotenv()
client = genai.Client(api_key=os.getenv("GENAI_API_KEY"))

prompt = """
  Extract the following information from the image:
    - title
    - starting_date: formatted as ISO 8601 datetime. If the description contains time, include it in the datetime.
    - ending_date: formatted as ISO 8601 datetime. Include the time if mentioned in the description.
    - description: preserve original formatting and capitalization. Do not use all uppercase, should be nicely capitalized, make sure it's nicely formatted, use dashes, bullet points, etc. Make the description SEO friendly.
    - location: more precise location can also be included in description, look for it.
    
  Additional instructions:
    Keep the original language. Do not translate.
    Do not add any extra information.
    Return only the extracted data in raw JSON format with the keys: title, starting_date, ending_date, description, location.
    Ensure the JSON is valid and properly formatted.
    Do not wrap the output in a code block or text block—just return the raw JSON.
    Remove "Pokaż mniej" or "Pokaż więcej" from the description if present.
    Make the description nicely readable and formatted, but do not change the original meaning, it should be capitalized, NOT uppercase, separate the text using new lines, add dashes, bullet points, etc., make it SEO friendly.
    If the starting date doesn't contain a time, assume it starts at 00:00:00.
    If the ending date doesn't contain a time, assume it ends at 23:59:59.
"""

def create_input(root, label, type="entry"):
    widget = None

    label_widget = tk.Label(root, text=label, font=("Arial", 10))
    label_widget.pack(anchor=tk.W, padx=20, pady=0)

    if type == "entry":
        widget = tk.Entry(root, font=("Arial", 12))
        widget.pack(fill=tk.X, padx=20, pady=2)
    elif type == "text":
        widget = tk.Text(root, font=("Arial", 12), height=5)
        widget.pack(fill=tk.BOTH, padx=20, pady=5, expand=True)

    def focus_callback(event=None):
        if type == "entry":
            widget.selection_range(0, tk.END)
        else:
            widget.tag_add("sel", "1.0", "end")

    widget.bind("<FocusIn>", focus_callback)

    return widget

def save_image(img: Image.Image):
    file_uuid = uuid.uuid4()
    filepath = os.path.join(TEMP_DIR, f"{str(file_uuid)}.png")
    img.save(filepath)
    return filepath

root = tk.Tk()
root.title("Moto Zloty - Image Scraper")
root.geometry("800x600")

label = tk.Label(root, text="Paste an image here (Ctrl+V)", font=("Arial", 11))
label.pack(pady=10)

title_input = create_input(root, "Title")
startup_date_input = create_input(root, "Starting date")
ending_date_input = create_input(root, "Ending date")
location_input = create_input(root, "Location")
description_input = create_input(root, "Description", "text")

progress_frame = tk.Frame(root)
progress_frame.pack(fill=tk.X, padx=20, pady=(5, 10))

progress = ttk.Progressbar(progress_frame, mode="indeterminate")
progress.pack(fill=tk.X)

copy_as_json_button = tk.Button(root, text="Copy as JSON", command=lambda:( root.clipboard_clear() or root.clipboard_append(
  json.dumps({
    "title": title_input.get(),
    "starting_date": startup_date_input.get(),
    "ending_date": ending_date_input.get(),
    "location": location_input.get(),
    "description": description_input.get("1.0", tk.END).strip()
  }, indent=2))), font=("Arial", 12))
copy_as_json_button.pack(pady=10)

def process_image_in_thread(img):
    try:
        def clear_fields():
            title_input.delete(0, tk.END)
            startup_date_input.delete(0, tk.END)
            ending_date_input.delete(0, tk.END)
            location_input.delete(0, tk.END)
            description_input.delete('1.0', tk.END)

        root.after(0, clear_fields)
        root.after(0, progress.start)

        image_path = save_image(img)
        print(f"Image saved to {image_path}")

        with open(image_path, 'rb') as file:
            image_bytes = file.read()

        print("Beginning processing...")

        response = client.models.generate_content(
            model='gemini-2.5-flash-preview-05-20',
            contents=[
                types.Part.from_bytes(
                    data=image_bytes,
                    mime_type='image/jpeg',
                ),
                prompt
            ]
        )
        print("Processing completed.")

        cleaned_response = response.text.replace('`', '').replace('json', '').strip()
        json_data = json.loads(cleaned_response)

        def update_ui():
            title_input.insert(0, json_data.get('title', ''))
            startup_date_input.insert(0, json_data.get('starting_date', ''))
            ending_date_input.insert(0, json_data.get('ending_date', ''))
            location_input.insert(0, json_data.get('location', ''))
            description_input.insert(tk.END, json_data.get('description', ''))
            progress.stop()

        root.after(0, update_ui)

        os.remove(image_path)
        print("Temporary image file removed.")

    except Exception as e:
        def show_error():
            progress.stop()
            messagebox.showerror("Error", str(e))
        root.after(0, show_error)

def on_paste(event=None):
    try:
        img = ImageGrab.grabclipboard()
        if isinstance(img, Image.Image):
            threading.Thread(target=process_image_in_thread, args=(img,), daemon=True).start()
        else:
            messagebox.showwarning("No image", "Clipboard does not contain an image")
    except Exception as e:
        messagebox.showerror("Error", str(e))

root.bind("<Control-v>", on_paste)
root.bind("<Control-V>", on_paste)

root.mainloop()
