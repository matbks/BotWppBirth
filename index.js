const DynamicCrudEndpoint = require('./crud2');

const app = new DynamicCrudEndpoint();
app.setupEndpoints('Aniversariantes');
app.start(4039);