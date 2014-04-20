module.exports = function(app,fs,lib) {

	app.get('/dashboard', function(req, res) {
		fs.readFile('./public/test.html',function (err, data) {
	      if (err) {
	        res.writeHead(500);
	        return res.end('Error loading index.html');
	      }

	      res.writeHead(200);
	      res.end(data);
		});
	});

	app.get('/', function(req, res) {
			fs.readFile('./public/index.html',function (err, data) {
		      if (err) {
		        res.writeHead(500);
		        return res.end('Error loading index.html');
		      }

		      res.writeHead(200);
		      res.end(data);
			});
		});

	app.all('*', function(req, res) {
		fs.readFile('./public/'+req.url,function (err, data) {
		      if (err) {
		        res.writeHead(500);
		        return res.end('Error loading index.html');
		      }

		      res.writeHead(200);
		      res.end(data);
			});
	});
}