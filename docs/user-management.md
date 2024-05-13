# User API
### Register User
Register a new user.
##### Endpoint
**POST** localhost/api/users/register
##### Request Body:

```
{
		username : "ary",
		password : "mypass123"
}
```
##### Response Body : Success

```
{
	data : {
		username : "ary",
	}
}

```
##### Response Body : Failed

```
{
	errors : "username already exist
}

```

### Login User
Login to an existing account.
##### Endpoint
**POST** localhost/api/users/login
##### Request Body:

```
{
		username : "ary",
		password : "mypass123"
}
```
##### Response Body : Success

```
{
	data : {
		token : "mytoken123"
	}
}

```
##### Response Body : Failed

```
{
	errors : "username or password is wrong"
}

```

### Get User
Get a user information.
##### Endpoint
**GET** localhost/api/users/:username
###### Header
Authorization : "token_user123"
##### Response Body : Success

```
{
	data : {
		username : "ary",
		bio : "😁😁😁"
	}
	
}

```
##### Response Body : Failed

```
{
	errors : "unauthorized"
}

```

### Update User
Update user information.
##### Endpoint
**PATCH** localhost/api/users/current
###### Header
Authorization : "token_user123"
##### Request Body:

```
{
		bio : "updated", // optional
		password : "newpass" // optional
}
```
##### Response Body : Success

```
{
	data : {
		username: "ary",
		bio : "updated"
	}
}

```
##### Response Body : Failed

```
{
	errors : "unauthorized"
}

```

### Logout User
Log out from the app.
##### Endpoint
**POST** localhost/api/users/logout
###### Header
Authorization : "token_user123"
##### Response Body : Success

```
{
	data : "OK"
}

```
##### Response Body : Failed

```
{
	errors : "Unauthorized"
}

```
