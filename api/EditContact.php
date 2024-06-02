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
		// Return connection error
		returnWithInfo("",0,"","","", "",$conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("SELECT * FROM contact WHERE id=? AND user_id=?");
		$stmt->bind_param("ii", $id, $user_id); 
		$stmt->execute();

		$result = $stmt->get_result();
		if( $result->num_rows == 0)
		{
			// If the contact is not on the database
			returnWithInfo("", 0, "", "", "", "", "Contact records not found");
		}
		else
		{
		        // Statement to edit the parameters
				$stmt = $conn->prepare("UPDATE contact SET name_first=?, name_last=?, phone=?, email=? WHERE id=? AND user_id=?");
				// This makes the connection safer (avoid injection attacks)
				$stmt->bind_param("ssssii", $firstName, $lastName, $phoneNumber, $email, $id, $user_id); 
		
				// In case any of the input fields are equal to null or empty
				if($id == NULL or $firstName == "" or $lastName == "" or $phoneNumber == "" or $email == "")
				{
					// Return error if fields are empty or null
					returnWithInfo("", 0, "", "", "", "","The fields cannot be null");
				}
				else
				{
					// Checking if the execution worked or not
					if($stmt->execute())
					{
						// Return updated information of the contact
						  returnWithInfo("Contact updated successfully", $id, $firstName, $lastName, $phoneNumber, $email, "");
					}
					else
					{
						// Return error in executing the update
						  returnWithInfo("", 0, "", "", "", "","Error updating the contact: ".$stmt->error);
					}
				}
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

	// Return response
	function returnWithInfo( $success, $id, $firstName, $lastName, $phoneNumber, $email, $err )
	{
		$retValue = '{"success": "'.$success.'","id": '.$id.',"firstName": "'.$firstName.'","lastName": "'.$lastName.'","phone": "'.$phoneNumber.'","email": "'.$email.'","error": "'.$err.'"}';
		sendResultInfoAsJson( $retValue );
	}

?>
