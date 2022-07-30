const mongoose = require('mongoose');

async function mongoCon() {
    mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true});
}

async function mongConnect() {

    const { MongoClient, ServerApiVersion } = require('mongodb');
    const uri = "mongodb+srv://kavehhn174:Kk135792468@cluster0.nmijf.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    client.connect(err => {
        const collection = client.db("weatherApp").collection("users");
        // perform actions on the collection object
        client.close();
    });

}
try {
    mongoCon();
    console.log('DB Connected')
}
catch (err) {
    console.log(err);
}
