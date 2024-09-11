<?php
	$inData = getRequestInfo();
	
	$id = $inData["id"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError($conn->connect_error);
	} 
	else
	{
		// Delete the contact identified by userId
		$stmt = $conn->prepare("DELETE FROM Contacts where ID=?");
		$stmt->bind_param("s", $id);
		
		if ($stmt->execute()) 
		{
			returnWithError(""); // No error, successful deletion
		} 
		else 
		{
			returnWithError("Failed to delete contact");
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
