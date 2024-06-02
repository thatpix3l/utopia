<?php
/* 	Login Endpoint
	Small Project
	Team 3 - COP4331
	Dr. Leinecker
	Summer 2024 - 5/25/2024
*/
	$inData = getRequestInfo();
	
	//variables
	$id = 0;
	$name_first = "";
	$name_last = "";
	$username = "";
	$password = $inData["password"];
	
	//Connects to database
	$conn = new mysqli("localhost", "TheBeast", "G3H0Fs55uhrWQ48Prb", "utopia"); 	
	if( $conn->connect_error )
	{
		// Return connection error
		returnWithInfo( "", 0, "", "", $conn->connect_error );
	}
	//Code to login
	else
	{
		//Selects id, username, name_first, name_last, and password
		$stmt = $conn->prepare("SELECT id,username,name_first,name_last,password_hash FROM user WHERE username=?");
		$stmt->bind_param("s", $inData["username"]);
		$stmt->execute();
		$result = $stmt->get_result();

		//If username is found
		if( $row = $result->fetch_assoc()  )
		{
			error_log("Fetched Row: " . print_r($row, true));

			//Verifys password and returns info if matches
			if (password_verify($password, $row['password_hash'])) {
				returnWithInfo($row['username'], $row['id'], $row['name_first'], $row['name_last'], "");
				
			//If doesnt match returns invalid password
			} else {
				returnWithInfo("", 0, "", "", "Invalid Password");
			}
		}
		//If no match returns no records found
		else
		{
			// Return fetch error, if the user does not have an account
			returnWithInfo("", 0, "", "", "No Records Found");
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
	function returnWithInfo( $username, $id, $name_first, $name_last, $err)
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $name_first . '","lastName":"' . $name_last . '","error":"'.$err.'"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
