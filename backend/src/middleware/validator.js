import { body, validationResult } from 'express-validator'

const VALID_CATEGORIES = [
  'ketenagakerjaan',
  'konsumen',
  'keluarga',
  'pertanahan',
  'pidana',
  'utang_kredit',
]

export const validateChatInput = [
  body('category')
    .isString()
    .notEmpty()
    .isIn(VALID_CATEGORIES)
    .withMessage('Kategori hukum tidak valid.'),

  body('userMessage')
    .isString()
    .notEmpty()
    .isLength({ max: 2000 })
    .withMessage('Pesan terlalu panjang. Maksimal 2000 karakter.'),

  body('messages')
    .isArray({ max: 20 })
    .withMessage('Riwayat pesan tidak valid.'),

  body('messages.*.role')
    .isString()
    .isIn(['user', 'assistant'])
    .withMessage('Role pesan tidak valid.'),

  body('messages.*.content')
    .isString()
    .notEmpty()
    .withMessage('Konten pesan tidak boleh kosong.'),

  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const firstError = errors.array()[0]
      const codeMap = {
        category: 'INVALID_CATEGORY',
        userMessage: 'MESSAGE_TOO_LONG',
        messages: 'INVALID_MESSAGES',
      }
      const field = firstError.path
      const code = codeMap[field] || 'VALIDATION_ERROR'

      return res.status(400).json({
        success: false,
        error: {
          code,
          message: firstError.msg,
        },
      })
    }
    next()
  },
]
