const errorHandler = (err, _req, res, _next) => {
  console.error('Unhandled error:', err)

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Terjadi kesalahan internal. Hubungi administrator.',
    },
  })
}

export default errorHandler
