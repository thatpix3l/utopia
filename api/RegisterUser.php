<?php
/* 	Register User Endpoint
	Small Project
	Team 3 - COP4331
	Dr. Leinecker
	Summer 2024 - 5/25/2024
*/

	$inData = getRequestInfo();
	
	//Variables
    $username = $inData["username"];
    $password = $inData["password"];
	$password_hash = password_hash($password, PASSWORD_DEFAULT);
	$name_first = $inData["name_first"];
	$name_last = $inData["name_last"];

	//Connects to database
	$conn = new mysqli("localhost", "TheBeast", "G3H0Fs55uhrWQ48Prb", "utopia");
	if ($conn->connect_error) 
	{
		returnWithInfo( "",$conn->connect_error );
	} 
	//Code to add user
	else
	{   
		$stmt = $conn->prepare("INSERT into utopia.user (username,password_hash,name_first,name_last) VALUES(?,?,?,?)");
		$stmt->bind_param("ssss", $username, $password_hash, $name_first, $name_last);

		if($username == "" or $password == "" or $name_first == "" or $name_last == "")
		{
			// Return error if parameters are null
			returnWithInfo("","The fields cannot be null");			
		}
		else
		{
			if($stmt->execute())
			//For testing if successful notifies
			{
				// Return success message
				returnWithInfo("User added successfully", "");
			}
			//If not successful explains why
			else
			{
				// Return error in executing user insertion
				returnWithInfo("","Error adding user: " . $stmt->error);
			}
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

	// Return response
	function returnWithInfo( $success, $err )
	{
		$retValue = '{"success": "' . $success .'","error": "'.$err.'"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
