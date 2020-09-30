var request = require('request')
const fs = require('fs')
var current

var provider = {
    config: {

    },

    addModuleConfiguration: function(moduleConfig) {

    },

    getData: function(callback) {
        var self = this
        var url = "https://api.thingspeak.com/channels/739378/feeds.json?results=1"
        request({
            url: url,
            method: 'GET'
        }, function(error, response, body) {
            if (error) {
                console.log("Error: " + err.message)
                callback(null)
            }
            callback(self.parseResponse(body))
            console.log("Done fetching...")
        })
    },

    parseResponse: function(response) {
        var result = JSON.parse(response)

        current = {
            current: {
                rainfallIntensity: result.feeds[0].field1,
                temp: result.feeds[0].field2,
                humidity: result.feeds[0].field3,
                windDirection: result.feeds[0].field4,
                windSpeed: result.feeds[0].field5,
                airPressure: result.feeds[0].field6
            }
        }

        console.log("Done parsing...")

        return current
    }
}

if (typeof module !== 'undefined') {
    module.exports = provider
}