# firebase-elasticsearch-search-worker

Labrary for process firebase searches

```javascript
var Firebase = require('firebase')
var SearchWorker = require('firebase-elasticsearch-search-worker')
var Elasticsearch = require('elasticsearch')

var client = new Elasticsearch.Client({
  host: 'localhost:9200'
})

var ref = new Firebase('https://<YOUR_APP_ID>.firebaseio.com')

var worker = new SearchWorker({
  ref: ref.child('search/articles'),
  client
})

worker.start()
```

Environment variable for indexer debug log: 

```
DEBUG=searchWorker
```

