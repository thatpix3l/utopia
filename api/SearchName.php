<?php
/* 	Search Name Endpoint
	Small Project
	Team 3 - COP4331
	Dr. Leinecker
	Summer 2024 - 5/25/2024
*/
	$inData = getRequestInfo();

	//variables
	$searchResults = "";
	$searchCount = 0;

	//connects to database
	$conn = new mysqli("localhost", "TheBeast", "G3H0Fs55uhrWQ48Prb", "utopia");
	if ($conn->connect_error) 
	{
		// Return connection error
		returnWithinfo( "",$conn->connect_error );
	} 
	//Code to search name
	else
	{
		//Searches using user_id and looks for associated first name, last name, phone, or email 
		$stmt = $conn->prepare("SELECT * FROM contact WHERE (CONCAT(name_first, ' ', name_last) LIKE ? OR phone LIKE ? OR email LIKE ?) AND user_id=?");
		//looks for value
		$colorName = "%" . $inData["search"] . "%";
		$stmt->bind_param("sssi", $colorName, $colorName, $colorName, $inData["user_id"]);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			//Returns contacts if found
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '{"id": ' . $row["id"] . ', "firstName": "' . $row["name_first"] . '", "lastName": "' . $row["name_last"] . '", "phone": "' . $row["phone"] . '", "email": "' . $row["email"] . '"}';

		}
		
		//If no contacts returns no records found
		if( $searchCount == 0 )
		{
			// Return error that the nothing was found
			returnWithInfo( "","No Records Found" );
		}
		else
		{
			// Return the contacts that have the search results
			returnWithInfo( $searchResults, "" );
		}
		
		$stmt->close();
		$conn->close();
	}
	//Gets JSON and converts to PHP
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}
	//Sends obj from PHP to JSON to print to screen
	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	//Returns response
	function returnWithInfo( $searchResults, $err )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":"'.$err.'"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
