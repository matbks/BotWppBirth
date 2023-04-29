const DynamicCrudEndpoint = require('./crud');

const app = new DynamicCrudEndpoint();
app.setupEndpoints('Aniversariantes');
app.start(3009);