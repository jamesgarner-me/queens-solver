def get_sorted_colour_regions(board):
    """Return a list of unique colours in the board"""
    # Find max colour value in board by flattening 2D array and getting max
    max_colour = max(max(row) for row in board)
    regions = [[] for _ in range(max_colour + 1)]

    # Iterate through board to find all instances of each colour
    for row in range(len(board)):
        for col in range(len(board)):
            colour = board[row][col]
            # Store every instance of each colour
            regions[colour].append([row, col])

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
    # Optimisation - get colour regions sorted from smallest to largest
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
