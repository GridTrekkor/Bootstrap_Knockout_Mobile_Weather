$(function() {

    function AppViewModel() {

        var main = this;

        // set initial vars
        main.showWeather = ko.observable(false);
        main.showSpinner = ko.observable(false);
        main.searchTerm = ko.observable("");
        main.locationError = ko.observable(false);
        main.errorType = ko.observable("Location not found.");

        main.searchWeather = function() {
            main.getWeather(main.searchTerm());
        };

        main.getWeather = function(loc) {

            main.showWeather(false);
            main.showSpinner(true);

            // convert location to upper case for API use
            loc = loc.toUpperCase();

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

                    if (data.current_observation.pressure_trend == "+") main.pressureTrend = ko.observable(("R"));
                    if (data.current_observation.pressure_trend == "0") main.pressureTrend = ko.observable(("S"));
                    if (data.current_observation.pressure_trend == "-") main.pressureTrend = ko.observable(("F"));

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