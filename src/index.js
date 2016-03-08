'use strict'

var debug = require('debug')('searchWorker')

class SearchWorker {
  constructor (options) {
    Object.assign(this, options, {
      index: options.ref.parent().key(),
      type: options.ref.key()
    })
  }

  start () {
    debug('start worker: %s/%s', this.index, this.type)

    this.ref.child('requests').on('child_added', this.processRequest.bind(this))
  }

  stop () {
    debug('stop worker')

    return this.ref.child('requests').off()
  }

  processRequest (snap) {
    const key = snap.key()

    debug('process request: %s/%s/%s', this.index, this.type, key)

    // Remove request from Firebase storage
    snap.ref().remove()

    this.search(snap)
    .then(this.processSearchResponse)
    .then(this.createResponse.bind(this, key))
    .catch((err) => debug(err.message, err))
  }

  createResponse (key, data) {
    debug('create response %s/%s/%s', this.index, this.type, key, data)

    return this.ref.child('responses/' + key).set(data)
  }

  search (snap) {
    const body = snap.val()

    debug('search %s/%s', this.index, this.type, body)

    return this.client.search({
      index: this.index,
      type: this.type,
      body
    })
  }

  processSearchResponse (body) {
    return {
      total: body.hits.total,
      index: body.hits.hits.reduce((result, hit) => {
        result[hit._id] = true
        return result
      }, {})
    }
  }

}

module.exports = SearchWorker

