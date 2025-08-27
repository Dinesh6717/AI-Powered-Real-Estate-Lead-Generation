import streamlit as st
import pandas as pd

st.title("Real Estate Lead Dashboard")
df = pd.read_csv("data/reddit_posts_analyzed.csv")
st.write("### High-Priority Leads", df[df["priority"] == "high"])