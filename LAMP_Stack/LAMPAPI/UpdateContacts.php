<?php
	$inData = getRequestInfo();
	
	$name = $inData["name"];
	$phone = $inData["phone"];
	$email = $inData["email"];
	$userId = $inData["userId"]; // UserId to identify the contact

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError($conn->connect_error);
	} 
	else
	{
		// Update name, phone, and email for the contact identified by userId
		$stmt = $conn->prepare("UPDATE Contacts SET Name=?, Phone=?, Email=? WHERE UserId=?");
		$stmt->bind_param("ssss", $name, $phone, $email, $userId);
		
		if ($stmt->execute()) 
		{
			returnWithError(""); // No error, successful update
		} 
		else 
		{
			returnWithError("Failed to update contact");
		}
		
		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError($err)
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}
?>
