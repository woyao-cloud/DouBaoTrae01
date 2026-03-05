const errorHandler = (err, req, res, next) => {
  console.error(err);
  
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      code: 400,
      message: err.errors.map(e => e.message).join(', ')
    });
  }

  res.status(500).json({
    code: 500,
    message: '服务器内部错误'
  });
};

module.exports = errorHandler;
