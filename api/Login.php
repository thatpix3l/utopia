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
	$username = "";
	
	//Connects to database
	$conn = new mysqli("localhost", "TheBeast", "G3H0Fs55uhrWQ48Prb", "utopia"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	//Code to login
	else
	{
		//Selects id, username, and password
		$stmt = $conn->prepare("SELECT id,username FROM user WHERE username=? AND password_hash=?");
		
		//FIX: Currently just using password_hash directly
		$stmt->bind_param("ss", $inData["username"], $inData["password_hash"]);
		$stmt->execute();
		$result = $stmt->get_result();

		//If username and password match returns username and id
		if( $row = $result->fetch_assoc()  )
		{
			returnWithInfo($row['username'], $row['id'],);
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
	function returnWithInfo( $username, $id )
	{
		$retValue = '{"id":' . $id . ',"username":"' . $username . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
