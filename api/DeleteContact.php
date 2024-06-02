<?php
/* Delete Contact Endpoint
 * Small Project
 * Team 3 - COP4331
 * Dr. Leinecker
 * Summer 2034 - 5/23/2024 */
	$inData = getRequestInfo();

    /* NOTE FOR SELF -> CHANGE THE NAME OF THE PARAMETERS FROM FRONT-END */
	
    // Variable holding parameters that will be deleted
	$id = $inData['id'];
  	$user_id = $inData['user_id'];

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
		returnWithInfo("" ,$conn->connect_error );
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
			returnWithInfo("", "Contact records not found");
		}
		else
		{
		        // Statement to delete the parameters
				$stmt = $conn->prepare("DELETE FROM contact where id=? AND user_id=?");
				$stmt->bind_param("ii", $id, $user_id); // Biding the ?s and expecting the ss to make it harder to have SQL injections
		
				// Checking if the required fields were null
				if($user_id == NULL or $id == NULL)
				{
					// Return error if parameters are null
					returnWithInfo("","The fields cannot be null");
				}
				else
				{
					// Checking if the execution worked or not
					if($stmt->execute())
					{
						// Return success message
						  returnWithInfo("Contact (id = ".$id.") Deleted from the database", "");
					}
					else
					{
						// Reutnr error in executing the deletion
						  returnWithInfo("" ,$stmt->error);
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
	function returnWithInfo( $success, $err )
	{
		$retValue = '{"success": "' . $success .'","error": "'.$err.'"}';
		sendResultInfoAsJson( $retValue );
	}

?>
