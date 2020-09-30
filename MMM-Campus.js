var current = {}

Module.register("MMM-Campus", {
    defaults: {
        animationSpeed: 0,
        initialLoadDelay: 8000,
        rotateInterval: 60 * 1000, 
	updateInterval: 5 * 1000,
        text: "Hello World"
    },

    scheduleUpdate: function() {
        setInterval(() => {}, this.config.updateInterval);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification == "WEATHER_RESULT") {
            this.current = payload
            var weather = this.current.current
            this.sendNotification("WEATHER")
            this.loaded = true
        }

        if (this.rotateInterval == null) {
            this.scheduleCarousel()
        }

        this.updateDom();
        this.config.updateInterval
    },

    getStyles: function() {
        if (this.config.css == "NOAA3") {
            return ["modules/MMM-Campus/css/MMM-NOAA3.css"];
        } else if (this.config.css == "NOAA2") {
            return ["modules/MMM-Campus/css/MMM-NOAA2.css"];
        } else if (this.config.css == "NOAA1") {
		return ["modules/MMM-Campus/css/MMM-NOAA1.css"];
	} else if (this.config.css == "NOAA4") {
		return ["modules/MMM-Campus/css/MMM-NOAA4.css"]; 
		 
	} else {
		return ["modules/MMM-Campus/css/MMM-NOAA5.css"];
	}
    },

    start: function() {
        Log.info("Starting module: " + this.name)
        this.sendSocketNotification('MMM-Campus', this.config);
        this.updateInterval = null
        this.current = {}
        this.rotateInterval = null
        this.loaded = true
    },

    getDom: function() {
        if (!this.loaded) {
            wrapper.classList.add("container")
            wrapper.innerHTML = "Gathering your weather info..."
            return wrapper
        }
        
        var wrapper = document.createElement("div")
        var current = this.current.current

        if (typeof current !== "undefined") {
            var temp = current.temp
            var humidity = current.humidity
            var rainfallIntensity = current.rainfallIntensity
            var windSpeed = current.windSpeed
            var windDirection = current.windDirection
            var airPressure = current.airPressure
        }

        var bigLayout = document.createElement("div")
        bigLayout.innerHTML = `
        <div class="divTable">
            <div class="divTableBody">
                <div class="divTableRow">
                    <div class="divTableHead">Temperature</div>
                    <div class="divTableHead">Rainfall Intensity</div>
                </div>
		<div class="divTableRow">
	            <div class="divTableCell">${temp}</div>
                    <div class="divTableCell">${rainfallIntensity}</div>
                </div>
            </div>
        </div>`
        wrapper.appendChild(bigLayout)

        var smallFirstLayout = document.createElement("div")
        smallFirstLayout.innerHTML = `
        <div class="divTable">
            <div class="divTableBody">
                <div class="divTableRow">
                    <div class="divTableHead">Humidity</div>
                    <div class="divTableHead">Air Pressure</div>
                </div>

                <div class="divTableRow">
                    <div class="divTableCell">${humidity}</div>
                    <div class="divTableCell">${airPressure}</div>
                </div>
            </div>
        </div>`
        wrapper.appendChild(smallFirstLayout)

        var smallSecondLayout = document.createElement("div")
        smallSecondLayout.innerHTML = `
        <div class="divTable">
            <div class="divTableBody">
                <div class="divTableRow">
                    <div class="divTableHead">Wind Direction</div>
                    <div class="divTableHead">Wind Speed</div>
                </div>

                <div class="divTableRow">
                    <div class="divTableCell">${windDirection}</div>
                    <div class="divTableCell">${windSpeed}</div>
                </div>
            </div>
        </div>`
        wrapper.appendChild(smallSecondLayout)
        return wrapper
    },

    scheduleCarousel: function() {
        this.rotateInterval = setInterval(() => {
            this.activeItem++;
            this.updateDom();
        }, this.config.rotateInterval);
    },
})