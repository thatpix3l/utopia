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
		returnWithError( $conn->connect_error );
	} 
	//Code to add contact
	else
	{
		$stmt = $conn->prepare("INSERT into utopia.contact (user_id,name_first,name_last,phone,email) VALUES(?,?,?,?,?)");
		$stmt->bind_param("issss", $user_id, $name_first, $name_last, $phone, $email);
		if($stmt->execute())
        //For testing if successful notifies
		{
            returnWithSuccess("Contact added successfully");
        }
		//If not successful explains why
        else
        {
            returnWithError("Error adding contact: " . $stmt->error);
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