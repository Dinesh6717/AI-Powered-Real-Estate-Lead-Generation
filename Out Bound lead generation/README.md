# 🏠 Real Estate Lead Generation with AI

![Python](https://img.shields.io/badge/Python-3.9%2B-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-Prototype-yellow)

This project automates real estate lead generation by scraping social media platforms (Reddit, Twitter), analyzing user intent using NLP, and prioritizing leads for follow-up. High-priority leads are automatically added to a CRM (Google Sheets) and notified via email.

---

## 🚀 Features

- **Data Collection**: Scrapes Reddit and Twitter for real estate-related posts.
- **NLP Analysis**: Uses Hugging Face's zero-shot classification to detect user intent (buying, selling, renting).
- **Lead Prioritization**: Ranks leads as low, medium, or high priority.
- **CRM Integration**: Stores leads in Google Sheets and notifies agents via email.
- **Zero-Cost Prototype**: Built entirely with free tools and open-source libraries.

---

## 📦 Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/real-estate-lead-gen.git
   cd real-estate-lead-gen
   ```

2. **Set Up a Virtual Environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set Up Secrets:**
   Rename `sample.env` to `.env` and fill in your credentials:
   ```env
   # Reddit API
   REDDIT_CLIENT_ID="your_client_id"
   REDDIT_CLIENT_SECRET="your_client_secret"
   REDDIT_USER_AGENT="LeadGenBot/1.0 by YourUsername"

   # Gmail
   GMAIL_USER="your.email@gmail.com"
   GMAIL_PASSWORD="your_app_password"

   # Google Sheets API
   # Download credentials.json from Google Cloud Console
   ```

---

## 🛠 Usage

1. **Scrape Data:**
   Run the Reddit and Twitter scrapers:
   ```bash
   python scripts/reddit_scraper.py
   python scripts/twitter_scraper.py
   ```

2. **Analyze Leads:**
   Classify posts using NLP:
   ```bash
   python scripts/nlp_analysis.py
   ```

3. **Update CRM & Notify Agents:**
   Add high-priority leads to Google Sheets and send emails:
   ```bash
   python scripts/crm_integration.py
   ```

---

## 📂 Project Structure

```
real-estate-lead-gen/
├── data/                   # Scraped and analyzed data (ignored by Git)
├── scripts/                # Python scripts
│   ├── reddit_scraper.py   # Scrapes Reddit posts
│   ├── twitter_scraper.py  # Scrapes Twitter posts
│   ├── nlp_analysis.py     # Analyzes text for real estate intent
│   ├── crm_integration.py  # Updates CRM and sends emails
├── .env                    # Environment variables (ignored by Git)
├── credentials.json        # Google Sheets API key (ignored by Git)
├── requirements.txt        # Python dependencies
├── README.md               # This file
└── sample.env              # Template for .env
```

---

## 🛡 Security

**Secrets Management:** All sensitive data (API keys, credentials) is stored in `.env` and excluded from Git using `.gitignore`.

**Data Privacy:** Scraped data is anonymized, and no personally identifiable information (PII) is stored.

---

## 🚨 Limitations

- **Rate Limits:** Reddit and Twitter APIs have rate limits. Avoid excessive scraping.
- **NLP Accuracy:** The zero-shot model may misclassify some posts. Fine-tuning with labeled data can improve results.
- **Email Limits:** Gmail allows ~100 emails/day for free accounts.

---

## 🚀 Future Enhancements

- Add more platforms (Facebook Marketplace, Craigslist).
- Fine-tune the NLP model with custom real estate data.
- Build a Streamlit dashboard for real-time lead tracking.
- Automate the pipeline with GitHub Actions or cron jobs.

---

## 🤝 Contributing

Contributions are welcome! Follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

---

## 📄 License

This project is licensed under the MIT License. See LICENSE for details.

---

## 🙏 Acknowledgments

- Hugging Face for the NLP models.
- PRAW for Reddit scraping.
- snscrape for Twitter scraping.

Made with ❤️ by Sathwik. Let’s connect on [LinkedIn](https://www.linkedin.com/in/sathwik-alagoni-056b692a0/)!
