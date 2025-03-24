import logging
import requests
import sys
import os
from pprint import pprint
from fastapi import FastAPI
from mangum import Mangum
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

# Get allowed origins from environment variable or use default for development
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173"  # Default for local development
).split(",")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    """Fetch CSRF token from the initial request"""
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
    """Make GraphQL request using CSRF token"""
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

    return response.json()

def get_sorted_colour_regions(board): 
    """Return a list of unique colours in the board"""
    # Initialise array to store coordinates for each colour
    
    # Find max colour value in board by flattening 2D array and getting max
    max_colour = max(max(row) for row in board)
    regions = [[] for _ in range(max_colour + 1)]
    
    # Iterate through board to find all instances of each colour
    for row in range(len(board)):
        for col in range(len(board)):
            colour = board[row][col]
            # Store every instance of each colour
            regions[colour].append([row, col])
    # Sort colour_coords by length of each subarray (number of coordinates for each colour)
    # Filter out empty arrays first, then sort by length
    regions = [coords for coords in regions if coords]
    regions.sort(key=len)
    
    return regions

def is_safe(board, queens, row, col):
    """Check if a queen can be placed on board[row][col]"""
    # Check row and column
    for queen in queens:
        q_row, q_col = queen["row"], queen["col"]
        
        # Check same row or column
        if row == q_row or col == q_col:
            return False
        
        # Check only immediate diagonal adjacency
        if abs(row - q_row) == 1 and abs(col - q_col) == 1:
            return False
    
    return True

def has_queen_in_region(queens, region):
    """Check if a colour region already has a queen"""
    for queen_pos in queens:
        if queen_pos in region:
            return True
    return False

def solve_board(board):
    """Solve the board using backtracking"""
    # Get colour regions sorted from smallest to largest
    colour_regions = get_sorted_colour_regions(board)
    queens = []
    
    def backtrack(region_index):
        # Base case: if we've placed queens in all regions, we're done
        if region_index >= len(colour_regions):
            return True
        
        # Get current region to process
        current_region = colour_regions[region_index]
        
        # Try each cell in the current region
        for cell in current_region:
            row, col = cell
            
            # Check if we can place a queen here
            if is_safe(board, queens, row, col):
                # Place the queen
                queens.append({"row": row, "col": col})
                
                # Recursively try to place queens in next regions
                if backtrack(region_index + 1):
                    return True
                
                # If placing queen here didn't work, remove it and try next position
                queens.pop()
        
        # If we've tried all positions in this region and none worked
        return False
    
    # Start backtracking from first region
    if backtrack(0):
        return queens
    else:
        return []  # No solution found

def parse_game(api_response):
    """Extract game board from API response"""
    try:
        # "colorGrid" in the API response is the game board
        grid = api_response["data"]["identityDashGamesByTodaysGame"]["elements"][0]["gamePuzzle"]["queensGamePuzzle"]["colorGrid"]
        puzzle_id = api_response["data"]["identityDashGamesByTodaysGame"]["elements"][0]["puzzleId"]
        grid_size = api_response["data"]["identityDashGamesByTodaysGame"]["elements"][0]["gamePuzzle"]["queensGamePuzzle"]["gridSize"]

        # todo make this error handling better
        if not grid:
            raise ValueError("'colorGrid' list is empty or missing in the response")
        if not puzzle_id:
            raise ValueError("'puzzle_id' list is empty or missing in the response")
        if not grid_size:
            raise ValueError("'grid_size' list is empty or missing in the response")
        
        # Initialise our own game board 2D array in preparation to copy
        board = [[0 for _ in range(grid_size)] for _ in range(grid_size)]

        # Iterate through the game board in the API response to create a local game board
        for i, row in enumerate(grid):
            if "colors" in row:
                board[i] = row["colors"]
            else:
                raise ValueError(f"'colors' not found in row {i} of 'colorGrid'")

        # solve the board
        solution = solve_board(board)

        # # Print the 2D array to confirm
        # print("2D Color Grid:")
        # for row in board:
        #     print(row)

        return {
            "puzzleId": puzzle_id,
            "gridSize": grid_size,
            "board": board,
            "solution": solution
        }

    except Exception as e:
        print(f"An error occurred while extracting game board from API response: {e}")
        
        return {
            "error": str(e)
        }

@app.get("/boards/latest")
def get_game():
    """API endpoint to return the game"""
    try: 
        csrf_token = fetch_csrf_token()
        api_response = make_api_request(csrf_token)
        game = parse_game(api_response)
        return game
    except Exception as e:
        print(f"An error occurred: {e}")   

# Wrap FastAPI app for AWS Lambda compatibility
handler = Mangum(app)

# if __name__ == "__main__":
#     """API endpoint to return the game"""
#     try: 
#         csrf_token = fetch_csrf_token()
#         api_response = make_api_request(csrf_token)
#         game = parse_game(api_response)
#         print(game)
#     except Exception as e:
#         print(f"An error occurred: {e}")  