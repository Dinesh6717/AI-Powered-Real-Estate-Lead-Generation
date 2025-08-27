import praw
import pandas as pd
import os
from dotenv import load_dotenv

# Load credentials from .env
load_dotenv()

# Initialize Reddit API
reddit = praw.Reddit(
    client_id=os.getenv("REDDIT_CLIENT_ID"),
    client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
    user_agent=os.getenv("REDDIT_USER_AGENT")
)

# Scrape posts from r/RealEstate
subreddit = reddit.subreddit("RealEstate")
posts = subreddit.hot(limit=50)  # Get 50 posts (adjust as needed)

# Extract data
posts_list = []
for post in posts:
    posts_list.append({
        "title": post.title,
        "author": str(post.author),
        "text": post.selftext,
        "url": post.url
    })

# Save to CSV
df = pd.DataFrame(posts_list)
df.to_csv("./data/reddit_posts.csv", index=False)
print("Data saved to data/reddit_posts.csv")
print(df)