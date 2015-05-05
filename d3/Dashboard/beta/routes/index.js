
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.external_data = function(req, res){
  res.render('external_data', {title: "External Data"});
};

exports.api_data = function(req, res){
  res.render('api_data', {title: "API Data"});
};

exports.scales_and_axes = function(req, res){
  res.render('scales_and_axes', {title: "Scales and Axes"});
};

exports.filters = function(req, res){
  res.render('filters', {title: "Filters"});
};

exports.maps = function(req, res){
  res.render('maps', {title: "Maps"});
};

exports.monitor = function(req, res){
  res.render('monitor', {title: "Monitor"});
};