<?php
/* 	Add Contact Endpoint
	Small Project
	Team 3 - COP4331
	Dr. Leinecker
	Summer 2024 - 5/25/2024
*/

	$inData = getRequestInfo();
	
	//Variables
	$user_id = $inData["user_id"];
    $name_first = $inData["name_first"];
    $name_last = $inData["name_last"];
    $phone = $inData["phone"];
    $email = $inData["email"];

	//Connects to database
	$conn = new mysqli("localhost", "TheBeast", "G3H0Fs55uhrWQ48Prb", "utopia");
	if ($conn->connect_error) 
	{
		// Return connection error
		returnWithInfo( "",$conn->connect_error );
	} 
	//Code to add contact
	else
	{
		$stmt = $conn->prepare("INSERT into utopia.contact (user_id,name_first,name_last,phone,email) VALUES(?,?,?,?,?)");
		$stmt->bind_param("issss", $user_id, $name_first, $name_last, $phone, $email);
		if($user_id == NULL or $name_first == "" or $name_last == "" or $phone == "" or $email == "")
		{
			// Return error if fields are empty or null
			returnWithInfo("", "The fields cannot be empty");
		}
		else
		{
			if($stmt->execute())
			//For testing if successful notifies
			{
				// Return success message
				returnWithInfo("Contact added successfully", "");
			}
			//If not successful explains why
			else
			{
				// Return error in executing the insertion
				returnWithInfo("","Error adding contact: " . $stmt->error);
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