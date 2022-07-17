const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');

// Switch the swagger document to swagger-output local.json to run documentation locally
const swaggerDocument = require('../swagger-output.json');

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

module.exports = router;