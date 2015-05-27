var countryUrl = function(country, metric) {
  return Settings.dataDir + 'graphic_' + metric + '_d_' + country.key + '.xml';
};

var metricsExist = function() {
  return !!CountryMetrics.findOne().metrics;
};

var countriesExist = function() {
  return CountryMetrics.find().count() > 0;
};

var fetchCountryData = function(country, metric) {
  var xmlParser = Npm.require('xml2js');

  var xmlData = HTTP.get(countryUrl(country, metric));

  xmlParser.parseString(xmlData.content, { attrkey: 'attr' }, function (error, result) {
    if (error) {
      throw new Error(error);
    }

    console.log(result);
    //doc.ts = new MongoInternals.MongoTimestamp(0, 0);
  });
};

var fetchCountries = function() {
  var xmlParser = Npm.require('xml2js');

  var xmlData = HTTP.get(Settings.countriesUrl);
  xmlParser.parseString(xmlData.content, { attrkey: 'attr' }, function (error, result) {
    if (error) {
      throw new Error(error);
    }

    var countries = result.root.countries[0].item;
    _.each(countries, function(country) {
      CountryMetrics.insert(country.attr);
    });
  });
};

if (!countriesExist()) {
  fetchCountries();
}

if (countriesExist() && !metricsExist()) {
  CountryMetrics.find({ key: '109' }).forEach(function(country) {
    fetchCountryData(country, Settings.defaultMetric);
  });
}
