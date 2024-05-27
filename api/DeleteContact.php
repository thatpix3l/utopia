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
	//$lastName = $inData['lastName'];
    //$phoneNumber = $inData['phoneNumber'];
	//$email = $inData['email'];

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
        // Statement to delete the parameters
		$stmt = $conn->prepare("DELETE FROM Contacts where ID=?");
		$stmt->bind_param("i", $id); // Biding the ?s and expecting the ss to make it harder to have SQL injections
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
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

?>