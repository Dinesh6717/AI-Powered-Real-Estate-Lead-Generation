import gspread
import pandas as pd
from oauth2client.service_account import ServiceAccountCredentials
import os
from dotenv import load_dotenv
import smtplib
from email.message import EmailMessage

# Load environment variables
load_dotenv()

# Authenticate with Google Sheets
scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
creds = ServiceAccountCredentials.from_json_keyfile_name("credentials.json", scope)
client = gspread.authorize(creds)

# Open the Google Sheet
sheet = client.open("Real Estate Leads").sheet1

# Load analyzed data
df = pd.read_csv("./data/reddit_posts_analyzed.csv")

# Filter high-priority leads
high_priority = df[df["priority"] == "high"]

# Append leads to Google Sheets
for _, row in high_priority.iterrows():
    author = row["author"]
    text = row["text"][:100] + "..."  # Truncate long text
    intent = row["intent"]
    priority = row["priority"]
    
    # Avoid duplicates
    existing = sheet.findall(author)
    if not existing:
        sheet.append_row([author, text, intent, priority, "No"])
        print(f"Added {author} to CRM")

print("CRM update complete!")


def send_email(to_email, body):
    msg = EmailMessage()
    msg.set_content(body)
    msg["Subject"] = "New Real Estate Lead"
    msg["From"] = os.getenv("GMAIL_USER")
    msg["To"] = to_email

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(os.getenv("GMAIL_USER"), os.getenv("GMAIL_PASSWORD"))
            smtp.send_message(msg)
            print(f"Email sent to {to_email}")
    except Exception as e:
        print(f"Failed to send email: {str(e)}")

# Send emails to high-priority leads (use Reddit username + "@gmail.com" as an example)
for _, row in high_priority.iterrows():
    email = f"{row['author']}@gmail.com"  # Simplified for prototyping
    body = f"Hi {row['author']},\nWe noticed you're interested in {row['intent']}. Contact us for assistance!"
    send_email(email, body)