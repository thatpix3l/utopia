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
		returnWithError( $conn->connect_error );
	} 
	//Code to add user
	else
	{   
		$stmt = $conn->prepare("INSERT into utopia.user (username,password_hash,name_first,name_last) VALUES(?,?,?,?)");
		$stmt->bind_param("ssss", $username, $password_hash, $name_first, $name_last);
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
