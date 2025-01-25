import logging
import requests

# Base URL of the API
GAME_BASE_URL = "https://www.linkedin.com/games/view/queens/desktop/"
API_BASE_URL = "https://www.linkedin.com/voyager/api/graphql"

# Set up logging
logging.basicConfig(
    level=logging.DEBUG,  # Set logging level to DEBUG for verbose output
    format="%(asctime)s - %(levelname)s - %(message)s"
)

# Step 1: Initialize a session to persist cookies
session = requests.Session()

# Step 2: Make the initial request to get cookies and the CSRF token
def fetch_csrf_token():
    logging.debug(f"Making GET request to {GAME_BASE_URL}...")
    
    # Replace this endpoint if the CSRF token is from a different route
    response = session.get(GAME_BASE_URL)  
    response.raise_for_status()  # Check for HTTP errors

    logging.debug(f"Response status code: {response.status_code}")
    logging.debug(f"Response headers: {response.headers}")
    logging.debug(f"Response body: {response.text[:500]}")  # Limit to 500 characters to avoid large logs

    # Access cookies and extract the CSRF token
    csrf_token = session.cookies.get("JSESSIONID")
    if not csrf_token:
        raise ValueError("JSESSIONID token not found in cookies")

    print(f"csrf_token Token: {csrf_token}")
    return csrf_token

# Step 3: Perform a GraphQL query with the CSRF token
def make_api_request(csrf_token):
    # Headers for the request
    headers = {
        "Content-Type": "application/json",
        "csrf-token": csrf_token,
    }

    # raw string as `requests` URL encodes the brackets
    query_string = "?includeWebMetadata=true&variables=(gameTypeId:3)&queryId=voyagerIdentityDashGames.3f8521c6cb0e550ebd391b373caa11fb"
    url = f"{API_BASE_URL}{query_string}"
    
    response = session.get(url, headers=headers)
    response.raise_for_status()  # Check for HTTP errors

    # Parse and print the response
    api_response = response.json()
    
    print("GraphQL Response:", api_response)
    

    return api_response
    
def parse_game(api_response):
    try:
        # Access the "colorGrid" from the response
        grid = api_response["data"]["identityDashGamesByTodaysGame"]["elements"][0]["gamePuzzle"]["queensGamePuzzle"]["colorGrid"]
        
        if not grid:
            raise ValueError("'colorGrid' list is empty or missing in the response")

        # Initialize an 8x8 integer array
        colour_grid = [[0 for _ in range(8)] for _ in range(8)]

        # Iterate through the rows in "colorGrid" and add each "colors" row to the 2D array
        for i, row in enumerate(grid):
            if "colors" in row:
                colour_grid[i] = row["colors"]
            else:
                raise ValueError(f"'colors' not found in row {i} of 'colorGrid'")

        puzzle_id = api_response["data"]["identityDashGamesByTodaysGame"]["elements"][0]["puzzleId"]

        # # Print the 2D array to confirm
        # print("2D Color Grid:")
        # for row in colour_grid:
        #     print(row)

        return {
            "puzzleId": puzzle_id,
            "board": colour_grid,
        }

    except Exception as e:
        print(f"An error occurred while extracting 'colorGrid': {e}")
        return {
            "error": str(e)
        }

# Step 4: Execute the script
if __name__ == "__main__":
    try:
        # Fetch the CSRF token from the initial request
        csrf_token = fetch_csrf_token()

        # Make the GraphQL request using the token
        api_response = make_api_request(csrf_token)

        # Extract game from API response 
        game = parse_game(api_response)
        print("game: ", game)

    except Exception as e:
        print(f"An error occurred: {e}")
