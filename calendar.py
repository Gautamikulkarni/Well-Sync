import tkinter as tk
from tkinter import ttk, messagebox, simpledialog
from googletrans import Translator
import datetime
import threading
import time

class Event:
    def __init__(self, name, event_type, start_date, duration_days, reminder_times):
        self.name = name
        self.event_type = event_type
        self.start_date = start_date
        self.duration_days = duration_days
        self.reminder_times = reminder_times
        self.end_date = start_date + datetime.timedelta(days=duration_days)
        self.notified_reminders = set()  # Keep track of which reminders have already been notified

    def __str__(self):
        return f"{self.name} ({self.event_type}) from {self.start_date.strftime('%Y-%m-%d')} for {self.duration_days} days"

class CalendarManager:
    def __init__(self):
        self.events = []

    def add_event(self, event):
        self.events.append(event)

    def delete_event(self, index):
        if 0 <= index < len(self.events):
            del self.events[index]

    def edit_event(self, index, new_event):
        if 0 <= index < len(self.events):
            self.events[index] = new_event

class EventSchedulerApp:
    def __init__(self, root, calendar_manager):
        self.root = root
        self.root.title("Health Reminder Scheduler")
        self.root.geometry("500x600")
        self.calendar_manager = calendar_manager

        self.root.configure(bg="#D6EAF8")

        # Language Selection for Translation
        self.language_var = tk.StringVar()
        self.language_var.set('en')  # Default language is English
        self.language_combobox = ttk.Combobox(root, textvariable=self.language_var, values=["en", "hi", "ta", "bn", "kn", "te", "mr", "gu", "pa", "ml"], state="readonly")
        self.language_combobox.grid(row=0, column=2, padx=10, pady=5, sticky="e")
        self.language_combobox.bind("<<ComboboxSelected>>", self.change_language)

        # Initialize Google Translator
        self.translator = Translator()

        # Translations for labels and titles
        self.translations = {
            'en': {
                'title': "Health Reminder Scheduler",
                'event_name': "Event Name:",
                'event_type': "Event Type:",
                'start_date': "Start Date (YYYY-MM-DD):",
                'duration': "Duration (Days):",
                'reminder_times': "Reminder Times (HH:MM, comma-separated):",
                'add_event': "➕ Add Event",
                'edit_event': "Edit",
                'delete_event': "Delete",
                'invalid_input': "Invalid Input",
                'enter_valid_data': "Please enter valid date and time format.",
                'event_reminder': "Event Reminder",
                'event_reminder_message': "Reminder: {event_name} is scheduled at {start_date} for time {reminder_time}"
            },
            'hi': {
                'title': "स्वास्थ्य अनुस्मारक योजना",
                'event_name': "घटना का नाम:",
                'event_type': "घटना प्रकार:",
                'start_date': "प्रारंभ तिथि (YYYY-MM-DD):",
                'duration': "अवधि (दिन):",
                'reminder_times': "अनुस्मारक समय (HH:MM, अल्पविराम से पृथक):",
                'add_event': "➕ घटना जोड़ें",
                'edit_event': "संपादित करें",
                'delete_event': "हटाएं",
                'invalid_input': "अमान्य इनपुट",
                'enter_valid_data': "कृपया मान्य तिथि और समय प्रारूप दर्ज करें।",
                'event_reminder': "घटना अनुस्मारक",
                'event_reminder_message': "अनुस्मारक: {event_name} {start_date} को {reminder_time} बजे अनुसूचित है।"
            },
           "kn": {
        "title": "ಆರೋಗ್ಯ ನಿಧಾನಕಾಲು ಯೋಜನೆ",
        "event_name": "ಘಟನೆ ಹೆಸರು:",
        "event_type": "ಘಟನೆಯ ಪ್ರಕಾರ:",
        "start_date": "ಪ್ರಾರಂಭ ದಿನಾಂಕ (YYYY-MM-DD):",
        "duration": "ಅವಧಿ (ದಿನಗಳು):",
        "reminder_times": "ನೋಟ್ ಸಮಯ (HH:MM, ಕಮಾ-ವಿರಾಮದಿಂದ):",
        "add_event": "➕ ಘಟನೆ ಸೇರಿಸಿ",
        "edit_event": "ಸಂಪಾದಿಸಿ",
        "delete_event": "ಅಳಿಸಿ",
        "invalid_input": "ಅಮಾನ್ಯ ಇನ್‌ಪುಟ್",
        "enter_valid_data": "ದಯವಿಟ್ಟು ಮಾನ್ಯ ದಿನಾಂಕ ಮತ್ತು ಸಮಯ ಸ್ವರೂಪವನ್ನು ನಮೂದಿಸಿ.",
        "event_reminder": "ಘಟನೆಯ ರಿಮೈಂಡರ್",
        "event_reminder_message": "ರಿಮೈಂಡರ್: {event_name} {start_date} ರಂದು {reminder_time} ಸಮಯದಲ್ಲಿ ಸೂಚಿಸಲಾಗಿದೆ."
    },
            # Add more languages here (e.g., 'ta', 'bn', 'kn', etc.)
        }

        # Initialize UI components
        self.event_name_entry = ttk.Entry(root, width=30)
        self.event_type_entry = ttk.Combobox(root, values=["Tablet", "Appointment", "Other"], state="readonly", width=27)
        self.event_start_date_entry = ttk.Entry(root, width=30)
        self.event_duration_entry = ttk.Entry(root, width=30)
        self.reminder_times_entry = ttk.Entry(root, width=30)
        self.add_event_button = ttk.Button(root, text="➕ Add Event", command=self.add_event)

        # Layout UI components
        self.load_ui_layout()

        # Now load the language-specific UI texts
        self.load_ui_text()

        # Start the reminder check thread
        threading.Thread(target=self.check_for_reminders, daemon=True).start()

    def load_ui_layout(self):
        """Layouts the UI components."""
        ttk.Label(self.root, text="Health Reminder Scheduler", font=("Arial", 16, "bold")).grid(row=0, column=0, columnspan=2, pady=15)

        ttk.Label(self.root, text="Event Name:").grid(row=1, column=0, padx=10, pady=5, sticky="w")
        self.event_name_entry.grid(row=1, column=1, padx=10, pady=5)

        ttk.Label(self.root, text="Event Type:").grid(row=2, column=0, padx=10, pady=5, sticky="w")
        self.event_type_entry.grid(row=2, column=1, padx=10, pady=5)
        self.event_type_entry.set("Tablet")

        self.custom_event_entry = ttk.Entry(self.root, width=30, state="disabled")
        self.custom_event_entry.grid(row=3, column=1, padx=10, pady=5)

        ttk.Label(self.root, text="Start Date (YYYY-MM-DD):").grid(row=4, column=0, padx=10, pady=5, sticky="w")
        self.event_start_date_entry.grid(row=4, column=1, padx=10, pady=5)

        ttk.Label(self.root, text="Duration (Days):").grid(row=5, column=0, padx=10, pady=5, sticky="w")
        self.event_duration_entry.grid(row=5, column=1, padx=10, pady=5)

        ttk.Label(self.root, text="Reminder Times (HH:MM, comma-separated):").grid(row=6, column=0, padx=10, pady=5, sticky="w")
        self.reminder_times_entry.grid(row=6, column=1, padx=10, pady=5)

        self.add_event_button.grid(row=7, column=0, columnspan=2, pady=10)

        self.event_listbox = tk.Listbox(self.root, width=50, height=8, bg="white", font=("Arial", 10))
        self.event_listbox.grid(row=8, column=0, columnspan=2, padx=10, pady=10)
        self.event_listbox.bind("<Button-3>", self.right_click_menu)

    def load_ui_text(self, lang='en'):
        """Update all UI elements text based on selected language"""
        lang_dict = self.translations.get(lang, self.translations['en'])

        self.root.title(lang_dict['title'])

        # Update labels and buttons
        ttk.Label(self.root, text=lang_dict['event_name']).grid(row=1, column=0, padx=10, pady=5, sticky="w")
        ttk.Label(self.root, text=lang_dict['event_type']).grid(row=2, column=0, padx=10, pady=5, sticky="w")
        ttk.Label(self.root, text=lang_dict['start_date']).grid(row=4, column=0, padx=10, pady=5, sticky="w")
        ttk.Label(self.root, text=lang_dict['duration']).grid(row=5, column=0, padx=10, pady=5, sticky="w")
        ttk.Label(self.root, text=lang_dict['reminder_times']).grid(row=6, column=0, padx=10, pady=5, sticky="w")

        self.add_event_button.config(text=lang_dict['add_event'])

    def change_language(self, event):
        selected_language = self.language_var.get()
        self.load_ui_text(selected_language)

    def add_event(self):
        event_name = self.event_name_entry.get()
        event_type = self.event_type_entry.get()
        if event_type == "Other":
            event_type = self.custom_event_entry.get()

        event_start_date_str = self.event_start_date_entry.get()
        event_duration_str = self.event_duration_entry.get()
        reminder_times_str = self.reminder_times_entry.get()

        try:
            event_start_date = datetime.datetime.strptime(event_start_date_str, "%Y-%m-%d")
            event_duration = int(event_duration_str)
            reminder_times = [(int(t.split(":")[0]), int(t.split(":")[1])) for t in reminder_times_str.split(",")]

            new_event = Event(event_name, event_type, event_start_date, event_duration, reminder_times)
            self.calendar_manager.add_event(new_event)
            self.update_event_listbox()
            self.clear_fields()
        except ValueError:
            messagebox.showerror("Invalid Input", "Please enter valid date and time format.")

    def clear_fields(self):
        """Clears all input fields after adding an event."""
        self.event_name_entry.delete(0, tk.END)
        self.event_type_entry.set("Tablet")
        self.custom_event_entry.delete(0, tk.END)
        self.custom_event_entry.config(state="disabled")
        self.event_start_date_entry.delete(0, tk.END)
        self.event_duration_entry.delete(0, tk.END)
        self.reminder_times_entry.delete(0, tk.END)

    def update_event_listbox(self):
        self.event_listbox.delete(0, tk.END)
        for event in self.calendar_manager.events:
            self.event_listbox.insert(tk.END, str(event))

    def right_click_menu(self, event):
        index = self.event_listbox.curselection()
        if not index:
            return

        menu = tk.Menu(self.root, tearoff=0)
        menu.add_command(label="Edit", command=lambda: self.edit_event(index[0]))
        menu.add_command(label="Delete", command=lambda: self.delete_event(index[0]))
        menu.post(event.x_root, event.y_root)

    def delete_event(self, index):
        self.calendar_manager.delete_event(index)
        self.update_event_listbox()

    def edit_event(self, index):
        event = self.calendar_manager.events[index]

        new_name = simpledialog.askstring("Edit Event", "Enter new event name:", initialvalue=event.name)
        new_event_type = simpledialog.askstring("Edit Event", "Enter new event type:", initialvalue=event.event_type)
        new_start_date_str = simpledialog.askstring("Edit Event", "Enter new start date (YYYY-MM-DD):", initialvalue=event.start_date.strftime('%Y-%m-%d'))
        new_duration_str = simpledialog.askstring("Edit Event", "Enter new duration (days):", initialvalue=str(event.duration_days))
        new_reminder_times_str = simpledialog.askstring("Edit Event", "Enter new reminder times (HH:MM, comma-separated):", initialvalue=",".join(f"{h:02}:{m:02}" for h, m in event.reminder_times))

        try:
            new_start_date = datetime.datetime.strptime(new_start_date_str, "%Y-%m-%d")
            new_duration = int(new_duration_str)
            new_reminder_times = [(int(t.split(":")[0]), int(t.split(":")[1])) for t in new_reminder_times_str.split(",")]

            updated_event = Event(new_name, new_event_type, new_start_date, new_duration, new_reminder_times)
            self.calendar_manager.edit_event(index, updated_event)
            self.update_event_listbox()
        except ValueError:
            messagebox.showerror("Invalid Input", "Please enter valid data.")

    def check_for_reminders(self):
        while True:
            current_time = datetime.datetime.now().strftime("%H:%M")
            for event in self.calendar_manager.events:
                for reminder_time in event.reminder_times:
                    reminder_time_str = f"{reminder_time[0]:02}:{reminder_time[1]:02}"
                    if current_time == reminder_time_str and reminder_time_str not in event.notified_reminders:
                        self.show_notification(event, reminder_time_str)
                        event.notified_reminders.add(reminder_time_str)  # Mark this reminder as notified
            time.sleep(1)  # Check every second (more frequently)

    def show_notification(self, event, reminder_time_str):
        # Show the notification for this event and reminder time
        self.root.after(0, lambda: messagebox.showinfo("Event Reminder", f"Reminder: {event.name} is scheduled at {event.start_date.strftime('%Y-%m-%d')} for time {reminder_time_str}"))

def main():
    root = tk.Tk()
    calendar_manager = CalendarManager()
    app = EventSchedulerApp(root, calendar_manager)
    root.mainloop()

if __name__ == "__main__":
    main()
