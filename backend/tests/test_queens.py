import unittest
from unittest.mock import patch, MagicMock
import json
from main import parse_game, solve_board, get_sorted_colour_regions, is_safe

class TestQueensSolver(unittest.TestCase):
    def setUp(self):
        # Sample board for testing
        self.sample_board = [
                    [2, 2, 2, 2, 2, 2, 2, 2],
                    [2, 1, 2, 1, 2, 2, 2, 0],
                    [3, 1, 2, 1, 2, 1, 2, 0],
                    [3, 1, 1, 1, 1, 1, 1, 0],
                    [3, 4, 1, 1, 1, 1, 1, 0],
                    [3, 4, 4, 1, 1, 1, 5, 0],
                    [3, 4, 4, 6, 6, 7, 5, 0],
                    [3, 4, 4, 6, 6, 7, 5, 0],
        ]
        
        # Mock API response for testing
        self.sample_api_response = {
            "data": {
                "identityDashGamesByTodaysGame": {
                    "elements": [
                        {
                            "puzzleId": "test123",
                            "gamePuzzle": {
                                "queensGamePuzzle": {
                                    "gridSize": 8,
                                    "colorGrid": [
                                        {"colors": [2, 2, 2, 2, 2, 2, 2, 2]},
                                        {"colors": [2, 1, 2, 1, 2, 2, 2, 0]},
                                        {"colors": [3, 1, 2, 1, 2, 1, 2, 0]},
                                        {"colors": [3, 1, 1, 1, 1, 1, 1, 0]},
                                        {"colors": [3, 4, 1, 1, 1, 1, 1, 0]},
                                        {"colors": [3, 4, 4, 1, 1, 1, 5, 0]},
                                        {"colors": [3, 4, 4, 6, 6, 7, 5, 0]},
                                        {"colors": [3, 4, 4, 6, 6, 7, 5, 0]}
                                    ]
                                }
                            }
                        }
                    ]
                }
            }
        }

    def test_get_sorted_colour_regions(self):
        """Test if colour regions are correctly identified and sorted"""
        regions = get_sorted_colour_regions(self.sample_board)
        
        # Check if we have the correct number of regions
        self.assertEqual(len(regions), 8)  # 8 different colours (0-7)
        
        # Check if regions are sorted by size (smallest first)
        region_sizes = [len(region) for region in regions]
        self.assertEqual(region_sizes, sorted(region_sizes))
        
        # Check specific regions
        # Region 7 should have 2 cells
        region_7_cells = [[6, 5], [7, 5]]
        
        # Find region 7 in the sorted regions
        region_7_found = False
        for region in regions:
            if all(cell in region for cell in region_7_cells):
                region_7_found = True
                self.assertEqual(len(region), 2)
                break
        self.assertTrue(region_7_found, "Region 7 not found in sorted regions")
        
        # Region 0 cells
        region_0_cells = [
            [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7]
        ]
        
        # Find region 0 in the sorted regions
        region_0_found = False
        for region in regions:
            if any(cell in region for cell in region_0_cells):
                region_0_found = True
                # Check that all expected cells are in this region
                for coord in region_0_cells:
                    self.assertIn(coord, region)
                break
        self.assertTrue(region_0_found, "Region 0 not found in sorted regions")

    def test_is_safe(self):
        """Test if queen placement safety is correctly determined"""
        # Empty board should allow queen placement
        self.assertTrue(is_safe(self.sample_board, [], 0, 0))
        
        # Test with existing queens
        queens = [
            {"row": 0, "col": 0},
            {"row": 2, "col": 3}
        ]
        
        # Same row
        self.assertFalse(is_safe(self.sample_board, queens, 0, 3))
        # Same column
        self.assertFalse(is_safe(self.sample_board, queens, 3, 0))
        # Diagonal adjacent
        self.assertFalse(is_safe(self.sample_board, queens, 1, 2))
        # Safe position
        self.assertTrue(is_safe(self.sample_board, queens, 4, 5))

    def test_solve_board(self):
        """Test if the board solver finds a valid solution"""
        solution = solve_board(self.sample_board)
        
        # Check if we have the right number of queens (one for each colour)
        self.assertEqual(len(solution), 8)
        
        # Check that no two queens threaten each other
        for i in range(len(solution)):
            for j in range(i + 1, len(solution)):
                queen1 = solution[i]
                queen2 = solution[j]
                
                # Check same row or column
                self.assertFalse(queen1["row"] == queen2["row"] or queen1["col"] == queen2["col"])
                
                # Check diagonally adjacent
                self.assertFalse(
                    abs(queen1["row"] - queen2["row"]) == 1 and 
                    abs(queen1["col"] - queen2["col"]) == 1
                )
                
        # Check that each queen is in a different colour region
        colours_with_queens = set()
        for queen in solution:
            row, col = queen["row"], queen["col"]
            colour = self.sample_board[row][col]
            
            # Each colour should only appear once
            self.assertNotIn(colour, colours_with_queens)
            colours_with_queens.add(colour)
            
        # All 8 colours should have a queen
        self.assertEqual(len(colours_with_queens), 8)

    def test_parse_game(self):
        """Test if API response is correctly parsed into game data"""
        game_data = parse_game(self.sample_api_response)
        
        # Check that all expected fields are present
        self.assertEqual(game_data["puzzleId"], "test123")
        self.assertEqual(game_data["gridSize"], 8)
        self.assertEqual(game_data["board"], self.sample_board)
        
        # Check that a solution was found
        self.assertTrue(len(game_data["solution"]) > 0)
        
        # Check that the solution has the correct number of queens
        self.assertEqual(len(game_data["solution"]), 8)

    @patch('main.fetch_csrf_token')
    @patch('main.make_api_request')
    def test_get_game_endpoint(self, mock_make_api_request, mock_fetch_csrf_token):
        """Test the API endpoint using mocks"""
        from main import get_game
        
        # Set up the mocks
        mock_fetch_csrf_token.return_value = "mock_token"
        mock_make_api_request.return_value = self.sample_api_response
        
        # Call the endpoint
        result = get_game()
        
        # Verify the expected behaviour
        mock_fetch_csrf_token.assert_called_once()
        mock_make_api_request.assert_called_once_with("mock_token")
        
        # Check the response
        self.assertEqual(result["puzzleId"], "test123")
        self.assertEqual(result["gridSize"], 8)
        self.assertTrue(len(result["solution"]) > 0)
        self.assertEqual(len(result["solution"]), 8)

if __name__ == "__main__":
    unittest.main()
