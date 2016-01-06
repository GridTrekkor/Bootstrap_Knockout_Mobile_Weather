$(function() {

    function AppViewModel() {

        var main = this;

        // set initial vars
        main.showWeather = ko.observable(false);
        main.showSpinner = ko.observable(false);
        main.searchTerm = ko.observable("");
        main.locationError = ko.observable(false);
        main.errorType = ko.observable("Location not found.");

        main.city = ko.observable();
        main.temperature = ko.observable();
        main.conditions = ko.observable();
        main.dewPoint = ko.observable();
        main.humidity = ko.observable();
        main.windDirection = ko.observable();
        main.windSpeed = ko.observable();
        main.pressure = ko.observable();
        main.pressureTrend = ko.observable();
        main.icon = ko.observable();

        main.searchWeather = function() {
            main.getWeather(main.searchTerm());
        };

        main.getWeather = function(loc) {

            main.showWeather(false);
            main.showSpinner(true);

            $.ajax({
                url: 'http://api.wunderground.com/api/a7942b382662121a/geolookup/conditions/forecast/astronomy/q/' + loc + '.json?callback=JSON_CALLBACK',
                dataType: 'jsonp'
            }).done(function (data) {

                main.showSpinner(false);

                if (data.response.error) {
                    if (data.response.error.type == "querynotfound") {
                        main.locationError(true);
                    }
                } else {

                    main.city(data['current_observation']['observation_location']['city']);
                    main.temperature(data['current_observation']['temp_f']);
                    main.conditions(data['current_observation']['weather']);
                    main.dewPoint(data['current_observation']['dewpoint_f']);
                    main.humidity(data['current_observation']['relative_humidity']);
                    main.windDirection(data['current_observation']['wind_dir']);
                    main.windSpeed(data['current_observation']['wind_mph']);
                    main.pressure(data['current_observation']['pressure_in']);
                    main.icon(data['current_observation']['icon_url']);

                    if (data['current_observation']['pressure_trend'] == "+") main.pressureTrend("R");
                    if (data['current_observation']['pressure_trend'] == "0") main.pressureTrend("S");
                    if (data['current_observation']['pressure_trend'] == "-") main.pressureTrend("F");

                    main.forecastsArray = ko.observableArray([]);

                    var i = 0;
                    while (i < data.forecast.simpleforecast.forecastday.length) {

                        var fc = data.forecast.simpleforecast.forecastday[i];

                        main.forecastsArray.push({
                            date: fc.date.weekday + " " + fc.date.month + "/" + fc.date.day,
                            hi: fc.high.fahrenheit,
                            lo: fc.low.fahrenheit,
                            icon: fc.icon_url
                        });

                        i++;

                    }

                    main.showWeather(true);

                }

            });

        };

    }

    ko.applyBindings(new AppViewModel());

});