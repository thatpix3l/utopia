<?php
/* Edit Contact Endpoint
 * Small Project
 * Team 3 - COP4331
 * Dr. Leinecker
 * Summer 2034 - 5/22/2024 */
	$inData = getRequestInfo();

    /* NOTE FOR SELF -> CHANGE THE NAME OF THE PARAMETERS FROM FRONT-END */
	
    // Getting the ID of the contact that wil be edited
    $user_id = $inData['user_id'];
    $id = $inData['id'];
	$firstName = $inData['name_first'];
	$lastName = $inData['name_last'];
    $phoneNumber = $inData['phone'];
	$email = $inData['email'];

    // Variable parameters to connect to the DB
    $address = "localhost";
    $user = "TheBeast";
    $password = "G3H0Fs55uhrWQ48Prb";
    $database_name = "utopia";

    // Connecting to the Database
	$conn = new mysqli($address, $user, $password, $database_name);

    // Trying connection
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
        // Statement to edit the parameters
		$stmt = $conn->prepare("UPDATE contact SET name_first=?, name_last=?, phone=?, email=? WHERE ID=? AND user_id=?");
		// This makes the connection safer (avoid injection attacks)
		$stmt->bind_param("ssssii", $firstName, $lastName, $phoneNumber, $email, $id, $user_id); 

		// In case any of the input fields are equal to null or empty
		if($id == NULL or $firstName == "" or $lastName == "" or $phoneNumber == "" or $email == "")
		{
			returnWithError("The fields cannot be null");
			exit();
		}
   
   
		// Checking if the execution worked or not
		if($stmt->execute())
   		{
     		returnWithSuccess("Contact (id = ".$id.") changed to ".$firstName." ".$lastName." Phone: ".$phoneNumber." Email: ".$email);
   		}
   		else
   		{
     		returnWithError("Error updating the contact: ".$stmt->error);
   		}
   
		$stmt->close();
		$conn->close();
	}

    // Function that request JSON info and converts it into a PHP value
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

    // Send the value obj from a PHP value to JSON and prints it to the screen
    function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

    // Return the error
    function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
 
 	// Return a success message for testing purposes
   	function returnWithSuccess( $message )
   	{
     	$retValue = '{"success":"' . $message . '"}';
		sendResultInfoAsJson( $retValue );
   	}

?>
