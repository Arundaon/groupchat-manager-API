# Group API
### Create Group	
Create a new group.
##### Endpoint
**POST** localhost/api/groups
###### Header
Authorization : "token_user123"
##### Request Body:

```json
{
		name : "grup baru",
		description : "cool group" //(optional)
}
```
##### Response Body : Success

```json
{
	data : {
		id : 2,
		name : "grup baru",
		description : "cool group",
		created_at : "2024-05-11T19:15:42.002Z",
	}
}

```
##### Response Body : Failed

```json
{
	errors : "unauthorized"
	
}

```

### List Joined Groups
List all groups that user joined in.
##### Endpoint
**GET** localhost/api/groups
###### Header
Authorization : "token_user123"
##### Response Body : Success

```json
{
	data : 
		[
	        {
	            "username": "ary",
	            "group_id": 1,
	            "role": "ADMIN",
	            "group": {
	                "id": 1,
	                "name": "first group",
	                "created_at": "2024-05-11T19:13:26.456Z",
	                "description": "first group description"
	        }
	        },
	        {
	            "username": "ary",
	            "group_id": 2,
	            "role": "MEMBER",
	            "group": {
	                "id": 2,
	                "name": "second group",
	                "created_at": "2024-07-11T15:14:23.532Z",
	                "description": "second group description"
		        }
	        }
	    ]
}

```
##### Response Body : Failed

```json
{
	errors : "unauthorized"
	
}

```

### Get Group information
Get information about a group, must be a member of the group.
##### Endpoint
**GET** localhost/api/groups/:groupId
###### Header
Authorization : "token_user123"
##### Response Body : Success

```json
{
	data : {
		id : 1,
		name : "group name",
		"created_at": "2024-05-11T19:15:42.002Z",
		description : "group description"
	}
	
}

```
##### Response Body : Failed

```json
{
	errors : "unauthorized"
	
}

```

### Update Group
Update group information, must be an admin.
##### Endpoint
**PUT** localhost/api/groups/:groupId
###### Header
Authorization : "token_user123"

##### Request Body

```json
{
	data : {
		name : "new name",
		description : "new group description"
	}
	
}
```
##### Response Body : Success

```json
{
	data : {
		id : 1,
		name : "new name",
		description : "new group description"
	}
	
}
```
##### Response Body : Failed

```json
{
	errors : "unauthorized"
	
}
```


### Add Member
Add new member of the group, must be an admin.
##### Endpoint
**POST** localhost/api/groups/:groupId/members
###### Header
Authorization : "token_user123"

##### Request Body

```json
{
	data : {
		username : "ary"
	}
}
```
##### Response Body : Success

```json
{
	data : {
		username : "ary",
		role : "MEMBER"
	}
	
}
```
##### Response Body : Failed

```json
{
	errors : "unauthorized"
	
}
```


### Remove Member
Remove a member in the group, must be an admin.
##### Endpoint
**POST** localhost/api/groups/:groupId/members
###### Header
Authorization : "token_user123"

##### Request Body

```json
{
	data : {
		username : "name"
	}
}
```
##### Response Body : Success

```json
{
	data : "OK"
	
}
```
##### Response Body : Failed

```json
{
	errors : "Unauthorized"
	
}
```
