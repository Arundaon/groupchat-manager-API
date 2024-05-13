# Message API
### Get Messages in a Group
Get all messages that has been sent in a group, must be a member in the group.
##### Endpoint
**GET** localhost/api/groups/:group_id/messages
###### Header
Authorization : "token_user123"
##### Response Body : Success

```json
{
	"data" : {
		[
			{
				"id" : 1,
				"body" : "hello world",
				"created_at" : "2024-05-12T04:51:32.822Z",
				"username" : "ary"
			},
			{
				"id" : 2,
				"body" : "hey",
				"created_at" : "2024-05-12T04:51:32.822Z",
				"username" : "doe"
			},
		]
	}
	
}

```
##### Response Body : Failed

```json
{
	"errors" : "unauthorized"
}

```


### Send a Message to a Group
Must be a member of the group.
##### Endpoint
**POST** localhost/api/group/:groupId/messages
###### Header
Authorization : "token_user123"
##### Request Body

```json
{
	"data" : {
		"body" : "hello world!"
	}
	
}

```
##### Response Body : Success

```json
{
	"data" : {
		"id" : 1,
		"body" : "hello world!",
		"created_at" : "2024-05-12T04:51:32.822Z",
		"username" : "ary"
	}
	
}

```
##### Response Body : Failed

```json
{
	"errors" : "Unauthorized"
}

```





TODO : DELETE MESSAGE

### Delete a Message in a Group
Must be a member in the group and must be user's own message.
##### Endpoint
**DELETE** localhost/api/group/:groupId/messages/:messageId
###### Header
Authorization : "token_user123"
##### Response Body : Success

```json
{
	"data" : "OK"
	
}

```
##### Response Body : Failed

```json
{
	"errors" : "Unauthorized"
}

```


