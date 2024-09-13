const urlBase = 'http://cop4331contacts.online/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
const map1 = new Map();

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function goRegister() 
{
	window.location.href = 'register.html';
}

function goLogin() 
{
	window.location.href = 'index.html';
}

function doRegister() {
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	let firstName = document.getElementById("firstName").value;
	let lastName = document.getElementById("lastName").value;

	//document.getElementById("registerResult").innerHTML = "";

	let tmp = {firstName:firstName, lastName:lastName, login:login, password:password};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/Register.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				saveCookie();	
				window.location.href = "index.html";
				document.getElementById("RegisterResult").innerHTML = "Registration Successful"
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("RegisterResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact()
{
	let Name = document.getElementById("contactName").value;
	let Phone = document.getElementById("phoneNumber").value;
	let Email = document.getElementById("contactEmail").value;
	document.getElementById("contactAddResult").innerHTML = "";

	let tmp = {
        Name: Name,
        Phone: Phone,
        Email: Email,
        UserId: userId
    };
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddContacts.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}

	
	
}

function searchContact()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	
	let table = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContacts.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				//Sets up the table and headers
				table += `<table id="contactsTable">`;
				table += `<tr id="header">`;
				table += `<th style="width:30%;">Name</th>`;
				table += `<th style="width:30%;">Phone Number</th>`;
				table += `<th style="width:30%;">Email</th>`;
				table += `<th style="width:10%;">Edit</th>`;
				table += `</tr>`;

				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{	
					table += `<tr>`;
					table += `<td id="nameColumn${i}">${jsonObject.results[i]["Name"]}</td>`;
					table += `<td id="phoneColumn${i}">${jsonObject.results[i]["Phone"]}</td>`;
					table += `<td id="emailColumn${i}">${jsonObject.results[i]["Email"]}</td>`;
					table += `<td><span id=editButtonSpan${i}><button id="editButton${i}" onClick=editContact(${i})>Edit</button></span>`;
					table += `<span id="deleteButtonSpan${i}">`;
					table += `<button id="deleteButton${i}" onClick=deleteContact(${i})>Delete</button></span></td>`;
					table += `</tr>`;
					map1.set(i, jsonObject.results[i]["ID"]);
				}
				table += `</table>`;
				document.getElementById("contactTableSpan").innerHTML = table; 
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
	
}


function editContact(index) {
	let oldName = document.getElementById(`nameColumn${index}`).innerHTML;
	let oldPhone = document.getElementById(`phoneColumn${index}`).innerHTML;
	let oldEmail = document.getElementById(`emailColumn${index}`).innerHTML;

	document.getElementById(`nameColumn${index}`).innerHTML = `<input id="nameInput${index}" type="text" value=${oldName}></input>`;
	document.getElementById(`phoneColumn${index}`).innerHTML = `<input id="phoneInput${index}" type="text" value=${oldPhone}></input>`;
	document.getElementById(`emailColumn${index}`).innerHTML = `<input id="emailInput${index}" type="text" value=${oldEmail}></input>`;

	document.getElementById(`editButtonSpan${index}`).innerHTML = `<button id="updateButton${index}" onClick=updateContact(${index})>Update</button>`;
}

function deleteContact(index) {
	
	let delete_name = document.getElementById(`nameColumn${index}`).innerHTML;
	
	let check_delete = confirm('Are You Sure You Want To Delete The Contact: ' + delete_name);

	if (check_delete === true)
	{

		let tmp = {
			id: map1.get(index)
		};
	
		let jsonPayload = JSON.stringify( tmp );
	
		let url = urlBase + '/DeleteContacts.' + extension;
	
		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.onreadystatechange = function() 
			{
				if (this.readyState == 4 && this.status == 200) 
				{
					searchContact();
				}
			};
			xhr.send(jsonPayload);
		}
		catch(err)
		{
			console.log("Update Failed");
		}	
	}



}

function updateContact(index) {
	let newName = document.getElementById(`nameInput${index}`).value;
	let newPhone = document.getElementById(`phoneInput${index}`).value;
	let newEmail = document.getElementById(`emailInput${index}`).value;

	let tmp = {
        name: newName,
        phone: newPhone,
        email: newEmail,
        id: map1.get(index)
    };
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/UpdateContacts.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById(`nameColumn${index}`).innerHTML = newName;//`<td id="nameColumn${index}">${newName}</td>`; 
				document.getElementById(`phoneColumn${index}`).innerHTML = newPhone;//`<td id="phoneColumn${index}">${newPhone}</td>`; 
				document.getElementById(`emailColumn${index}`).innerHTML = newEmail;//`<td id="emailColumn${index}">${newEmail}</td>`; 

				document.getElementById(`editButtonSpan${index}`).innerHTML = `<button id="editButton${index}" onClick=editContact(${index})>Edit</button>`;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		console.log("Update Failed");
	}	
}