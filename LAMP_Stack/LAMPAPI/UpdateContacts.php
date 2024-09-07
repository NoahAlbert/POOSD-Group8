<?php
	$inData = getRequestInfo();

	// Parameters for updating
	$userId = $inData["userId"];
	$name = isset($inData["name"]) ? $inData["name"] : null;
	$phone = isset($inData["phone"]) ? $inData["phone"] : null;
	$email = isset($inData["email"]) ? $inData["email"] : null;

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError($conn->connect_error);
	} 
	else 
	{
		// Updating only provided fields
		$query = "UPDATE Contacts SET ";
		$params = array();
		$types = "";

		
		if ($name !== null) {
			$query .= "Name=?, ";
			$params[] = $name;
			$types .= "s";
		}
		if ($phone !== null) {
			$query .= "Phone=?, ";
			$params[] = $phone;
			$types .= "s";
		}
		if ($email !== null) {
			$query .= "Email=?, ";
			$params[] = $email;
			$types .= "s";
		}

		
		$query = rtrim($query, ', ') . " WHERE UserId=?";
		$params[] = $userId;
		$types .= "i";  //userId is an int

		
		$stmt = $conn->prepare($query);
		$stmt->bind_param($types, ...$params);

		// Execute the statement
		if ($stmt->execute() === TRUE) 
		{
			returnWithError(""); // Success
		} 
		else 
		{
			returnWithError("Update failed: " . $stmt->error);
		}

		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}
?>
