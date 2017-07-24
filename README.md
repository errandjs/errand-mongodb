# errand-mongodb
> [errand](https://github.com/errandjs/errand) worker component used for mongodb

## Usage

```

npm install errand-mongodb

```

Notes:

1. For dependencies and suggested usage of errand worker components refer to [errand](https://github.com/errandjs/errand)
2. Set environment variable ERRAND_MONGODB_URL with connection string for mongodb server, if not set module will default to `mongodb://localhost:27017`

## Example

```

{
	"tasks": [

		{
			"task": "errand-mongodb",
			"data": {
				"description": "replace-with-task-description",
				"request": {
					"database": "replace-with-mongodb-database-name",
					"collection": "replace-with-name-of-collection",
					"method": "replace-with-mongodb-method",
					"parameters": {
						...
					}
				}
			}
		}

	]
}

```

Notes:

* **tasks** - [errand](https://github.com/errandjs/errand) task list
* **tasks[].task** - required `errand-mongodb` task name
* **tasks[].data.description** - optional task description
* **tasks[].data.request.database** - required mongodb database name
* **tasks[].data.request.collection** - required mongodb collection name
* **tasks[].data.request.method** - required mongodb method
* **tasks[].data.request.parameters** - required mongodb method parameters, the parameter payload will vary depending on method

### Aggregate Example 

```

{
	"tasks": [
		{
			"task": "errand-mongodb",
			"data": {
				"description": "replace-with-task-description",
				"request": {
					"database": "errand_test",
					"collection": "orders",
					"method": "aggregate",
					"parameters": {
						"pipeline": [
							{ "$match": { "status": "A" } },
							{ "$group": { "_id": "$cust_id", "total": { "$sum": "$amount" } } },
							{ "$sort": { "total": -1 } },
							{ "$out": "errand_aggregate_test_result" }
						],
                        "helpers": [
                            { "created_at": "lastday" }
                        ]
					}
				}
			}
		}
	]
}

```

Notes:

* **tasks[].data.request.parameters.pipeline** - for pipeline source data refer to [group by and calculate a sum example in mongodb db.collection.aggregate() documentation](https://docs.mongodb.com/manual/reference/method/db.collection.aggregate/#db.collection.aggregate). Note that in this case with `$out` collection `errand_aggregate_test_result` will be replaced with result.
* **tasks[].data.request.parameters.helpers** - used to add helpers to beginning of aggregate pipeline where, each object consists of `key` and `value` where key contains name of field to apply function in value. Helper functions include:
  * **lastday** - is used to add date range for matching records from the previous day.