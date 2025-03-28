import logging
import requests
from ..config import GAME_BASE_URL, API_BASE_URL, LOG_FORMAT, LOG_LEVEL, QUERY_STRING

# Set up logging
logging.basicConfig(level=getattr(logging, LOG_LEVEL), format=LOG_FORMAT)

# Initialize a session to persist cookies
session = requests.Session()


def fetch_csrf_token():
    """Fetch CSRF token from the initial request"""
    logging.debug(f"Making GET request to {GAME_BASE_URL}...")

    response = session.get(GAME_BASE_URL)
    response.raise_for_status()

    logging.debug(f"Response status code: {response.status_code}")
    logging.debug(f"Response headers: {response.headers}")
    logging.debug(f"Response body: {response.text[:500]}")  # Limit to 500 characters

    csrf_token = session.cookies.get("JSESSIONID")
    if not csrf_token:
        raise ValueError("JSESSIONID token not found in cookies")

    print(f"csrf_token Token: {csrf_token}")
    return csrf_token


def make_api_request(csrf_token):
    """Make GraphQL request using CSRF token"""
    headers = {
        "Content-Type": "application/json",
        "csrf-token": csrf_token,
    }

    url = f"{API_BASE_URL}{QUERY_STRING}"

    response = session.get(url, headers=headers)
    response.raise_for_status()

    return response.json()
