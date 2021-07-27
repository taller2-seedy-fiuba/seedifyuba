const app = require("./config");
const superagent = require('superagent');

const servicesApiBaseUrl = app.services.api.baseurl;

const getService = async (serviceId) => {
    console.log('Fetching service with id ['+serviceId+']')
    const service = await superagent.get(servicesApiBaseUrl + '/services/' + serviceId);
    return service.body;
};

module.exports = { getService };
