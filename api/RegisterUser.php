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
    $password_hash = $inData["password_hash"];

	//Connects to database
	$conn = new mysqli("localhost", "TheBeast", "G3H0Fs55uhrWQ48Prb", "utopia");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	//Code to add user
	else
	{
        //FIX: Create Hashing
        
		$stmt = $conn->prepare("INSERT into utopia.user (username,password_hash) VALUES(?,?)");
		$stmt->bind_param("ss", $username, $password_hash);
		if($stmt->execute())
        //For testing if successful notifies
		{
            returnWithSuccess("User added successfully");
        }
		//If not successful explains why
        else
        {
            returnWithError("Error adding user: " . $stmt->error);
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
	//returns error
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	//returns success
	function returnWithSuccess($message)
    {
        $retValue = '{"success":"' . $message . '"}';
        sendResultInfoAsJson($retValue);
    }
	
?>