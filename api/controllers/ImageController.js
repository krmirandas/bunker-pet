module.exports = {
  download: function(req, res) {
    console.log("==========================");
    res.sendfile(req.path.substr(1));
  }
};
