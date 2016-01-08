'use strict';

$(function() {

    function AppViewModel() {

        var main = this;

        // set initial vars
        main.showWeather = ko.observable(false);
        main.showSpinner = ko.observable(false);
        main.locationError = ko.observable(false);
        main.searchTerm = ko.observable("");
        main.errorType = ko.observable("Location not found.");

        // pass search term to main getWeather function
        main.searchWeather = () => { main.getWeather(main.searchTerm().toUpperCase()); };

        main.getWeather = (loc) => {

            main.showWeather(false);
            main.showSpinner(true);

            $.ajax({
                url: 'http://api.wunderground.com/api/a7942b382662121a/geolookup/conditions/forecast/astronomy/q/' + loc + '.json?callback=JSON_CALLBACK',
                dataType: 'jsonp'
            }).done(function (data) {

                main.showSpinner(false);

                if (data.response.error) {
                    if (data.response.error.type == "querynotfound") {
                        // display error if searched location is not found
                        main.locationError(true);
                    }
                } else {
                    main.locationError(false);

                    // connect JSON response to observables
                    main.city = ko.observable((data.current_observation.observation_location.city));
                    main.temperature = ko.observable((data.current_observation.temp_f));
                    main.conditions = ko.observable((data.current_observation.weather));
                    main.dewPoint = ko.observable((data.current_observation.dewpoint_f));
                    main.humidity = ko.observable((data.current_observation.relative_humidity));
                    main.windDirection = ko.observable((data.current_observation.wind_dir));
                    main.windSpeed = ko.observable((data.current_observation.wind_mph));
                    main.pressure = ko.observable((data.current_observation.pressure_in));
                    main.icon = ko.observable((data.current_observation.icon_url));

                    let pressureTrend = data.current_observation.pressure_trend;
                    if (pressureTrend == "+") main.pressureTrend = ko.observable(("R"));
                    if (pressureTrend == "0") main.pressureTrend = ko.observable(("S"));
                    if (pressureTrend == "-") main.pressureTrend = ko.observable(("F"));

                    // build forecast array
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