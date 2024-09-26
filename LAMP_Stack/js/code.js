const urlBase = 'http://cop4331contacts.online/LAMPAPI';
const extension = 'php';




// Used for add contacts modal
const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");
const modal = document.getElementById("modal");

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
				if(login == "" || password == "")
				{
					document.getElementById("loginResult").innerHTML = "Invalid Login field";
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

				document.getElementById("contactName").value = "";
				document.getElementById("phoneNumber").value = "";
				document.getElementById("contactEmail").value = "";
				searchContact();
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
				table += `<div id=contactTableDiv>`;
				table += `<h3>CONTACT TABLE</h3>`;


				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{	
					table += `<span id=contactSpan${i}>`;
					table += `<span id=nameSpan${i}>`;
					table += `<p style="font-weight: bold;">Name:&nbsp;</p>`
					table += `<p id="name${i}">${jsonObject.results[i]["Name"]}</p>`;
					table += `</span>`;
					table += `<span id=phoneSpan${i}>`;
					table += `<p style="font-weight: bold;">Phone:&nbsp;</p>`
					table += `<p id="phone${i}">${jsonObject.results[i]["Phone"]}</p>`;
					table += `</span>`;
					table += `<span id=emailSpan${i}>`;
					table += `<p style="font-weight: bold;">Email:&nbsp;</p>`
					table += `<p id="email${i}">${jsonObject.results[i]["Email"]}</p>`;
					table += `</span>`;
					table += `<span id=buttonSpan${i}>`;
					table += `<button id="editButton${i}" class="buttons" onClick=editContact(${i})>Edit</button>`;
					table += `<button id="deleteButton${i}" class="buttons" onClick=deleteContact(${i})>Delete</button>`;
					table += `</span>`;
					table += `</span>`;
					map1.set(i, jsonObject.results[i]["ID"]);
				}
				table += `</div>`;
				console.log(table);
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
	let oldName = document.getElementById(`name${index}`).innerHTML;
	let oldPhone = document.getElementById(`phone${index}`).innerHTML;
	let oldEmail = document.getElementById(`email${index}`).innerHTML;
	
	console.log(oldname);

	document.getElementById(`name${index}`).innerHTML = `<input id="nameInput${index}" type="text" value=${oldName}></input>`;
	document.getElementById(`phone${index}`).innerHTML = `<input id="phoneInput${index}" type="text" value=${oldPhone}></input>`;
	document.getElementById(`email${index}`).innerHTML = `<input id="emailInput${index}" type="text" value=${oldEmail}></input>`;

	editButton = document.getElementById(`editButton${index}`);
	editButton.innerHTML = "Save";
	editButton.setAttribute("onClick", `updateContact(${index})`);
}

function deleteContact(index) {
	
	let delete_name = document.getElementById(`name${index}`).innerHTML;
	
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
				document.getElementById(`name${index}`).innerHTML = newName;
				document.getElementById(`phone${index}`).innerHTML = newPhone;
				document.getElementById(`email${index}`).innerHTML = newEmail;

				editButton = document.getElementById(`editButton${index}`);
				editButton.innerHTML = "Edit";
				editButton.setAttribute("onClick", `editContact(${index})`);
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		console.log("Update Failed");
	}	
}

// Add Contacts modal pop up
function openAddContact()
{

	modal.classList.add("open");

	  
	closeBtn.addEventListener("click", () => {
		modal.classList.remove("open");
	});
}
  

// PASSWORD REQUIREMENTS
function validSignup()
{
	// Used for password requirements
	let myInput = document.getElementById("loginPassword");
	let letter = document.getElementById("letter");
	let capital = document.getElementById("capital");
	let number = document.getElementById("number");
	let length = document.getElementById("length");

	// When the user clicks on the password field, show the message box
	document.getElementById("message").style.display = "block";

	// When the user clicks outside of the password field, hide the message box
	myInput.onblur = function() {
	document.getElementById("message").style.display = "none";
	}

	// When the user starts to type something inside the password field
	myInput.onkeyup = function() 
	{
		// Validate lowercase letters
		var lowerCaseLetters = /[a-z]/g;
		if(myInput.value.match(lowerCaseLetters)) 
		{
			letter.classList.remove("invalid");
			letter.classList.add("valid");
		} 
		else 
		{
			letter.classList.remove("valid");
			letter.classList.add("invalid");
		}

		// Validate capital letters
		var upperCaseLetters = /[A-Z]/g;
		if(myInput.value.match(upperCaseLetters))
		{
			capital.classList.remove("invalid");
			capital.classList.add("valid");
		} 
		else 
		{
			capital.classList.remove("valid");
			capital.classList.add("invalid");
		}

		// Validate numbers
		var numbers = /[0-9]/g;
		if(myInput.value.match(numbers))
		{
			number.classList.remove("invalid");
			number.classList.add("valid");
		}
		else
		{
			number.classList.remove("valid");
			number.classList.add("invalid");
		}

		// Validate length
		if(myInput.value.length >= 8) {
			length.classList.remove("invalid");
			length.classList.add("valid");
		} 
		else
		{
			length.classList.remove("valid");
			length.classList.add("invalid");
		}
	}
}
