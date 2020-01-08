import * as responseError from '../responseError';

export default (app, cloudFunction) => {
    app.use(async (req, res, next) => {
        req.body = req.body || {};
        console.log('req body: ', req.body);
        try {
            const data = await cloudFunction(req, res, next);
            console.log('request successful : ', data);
            if (data && data.fileData) {
                res.set('Content-disposition', 'attachment; filename=' + data.fileName);
                res.send(new Buffer(data.fileData));
            } else if (data && data.redirectLocation) {
                res.redirect(301, data.redirectLocation);
            } else if (data && data.isXml) {
                res.send(data.xmlString);
            } else {
                res.send({ data });
            }
        } catch (e) {
            console.log('ERROR occured : ', e);
            if (!(e instanceof responseError.HttpsError)) {
                e = new responseError.HttpsError(
                    responseError.FunctionsErrorCode.unknown,
                    'Error unkown'
                );
            }
            res.status(e.httpStatus).send({ error: e.toJSON() });
        }
    });
};
