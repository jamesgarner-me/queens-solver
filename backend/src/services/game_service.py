from utils.board_solver import solve_board
from services.api_service import fetch_csrf_token, make_api_request


def parse_game(api_response):
    """Extract game board from API response"""
    try:
        # "colorGrid" in the API response is the game board
        grid = api_response["data"]["identityDashGamesByTodaysGame"]["elements"][0]["gamePuzzle"]["queensGamePuzzle"][
            "colorGrid"
        ]
        puzzle_id = api_response["data"]["identityDashGamesByTodaysGame"]["elements"][0]["puzzleId"]
        grid_size = api_response["data"]["identityDashGamesByTodaysGame"]["elements"][0]["gamePuzzle"][
            "queensGamePuzzle"
        ]["gridSize"]

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

        return {"puzzleId": puzzle_id, "gridSize": grid_size, "board": board, "solution": solution}

    except Exception as e:
        print(f"An error occurred while extracting game board from API response: {e}")
        return {"error": str(e)}


def get_latest_game():
    """Get the latest game from LinkedIn"""
    try:
        csrf_token = fetch_csrf_token()
        api_response = make_api_request(csrf_token)
        return parse_game(api_response)
    except Exception as e:
        print(f"An error occurred: {e}")
        return {"error": str(e)}
