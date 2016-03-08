# firebase-elasticsearch-search-worker

Labrary for process firebase searches

### Server side

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

### Client side

```javascript
var Firebase = require('firebase')
var ref = new Firebase('https://<YOUR_APP_ID>.firebaseio.com')

const queue = firebase.child('search/articles')

// create search request
const reqRef = queue.child('requests').push({
  query: {
    match: {
      keywords: ['react', 'firebase']
    }
  }
})

// On search result callback
const callback = (data) => {
  console.log('articles index:', data)
}

// subscribe to search result
queue.child('responses/' + reqRef.key()).on('value', function fn (snap) {
  if (snap.val()) {     // wait for data
    snap.ref().off('value', fn) // stop listening
    snap.ref().remove()         // clear the queue
    callback(snap.val())
  }
})
```

Environment variable for indexer debug log: 

```
DEBUG=searchWorker
```

