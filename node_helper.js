const NodeHelper = require('node_helper')
const request = require('request')
const fs = require('fs')

module.exports = NodeHelper.create({
    
    config: {
		updateInterval:  5 * 1000,
        initialLoadDelay: 400000
    },
    provider: null,
    providers: {
        thingspeak: 'ts'
    },

    start: function() {
        var self = this
        setTimeout(function() {
            
        });
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "MMM-Campus") {
            this.sendSocketNotification("MMM-Campus")
            this.provider = this.getProviderFromConfig(payload)
            this.provider.addModuleConfiguration(payload)
            this.config = payload
            this.getData()
        }
        this.scheduleUpdate(this.config.updateInterval)
    },

    scheduleUpdate: function() {
        var self = this;
        self.updateInterval = setInterval(() => {
            console.log('Campus weather updated.. next update in 1 hour');
            self.getData();			
        }, self.config.updateInterval);
    },

    getData: function() {
        var self = this;
        self.provider.getData(function(response) {
            self.sendSocketNotification("WEATHER_RESULT", response ? response : 'NO_WEATHER_RESULT'); 
        });
    },

    getProviderFromConfig: function(config) {
        if (!this.providers[config.provider]) {
            throw new Error('Invalid config No provider selected');
        }
		console.log(this.providers[config.provider]);
        return require('./providers/' + this.providers[config.provider] + '.js');
    }
})