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
		returnWithError( $conn->connect_error );
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
				returnWithInfo($row['username'], $row['id'], $row['name_first'], $row['name_last']);
				
			//If doesnt match returns invalid password
			} else {
				returnWithError("Invalid Password");
			}
		}
		//If no match returns no records found
		else
		{
			returnWithError("No Records Found");
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
	
	//Returns Error
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"username":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	//Returns id and username
	function returnWithInfo( $username, $id, $name_first, $name_last)
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $name_first . '","lastName":"' . $name_last . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
