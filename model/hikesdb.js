import {join} from "path"
import { MongoClient, ServerApiVersion } from 'mongodb';
import {writeFileSync, readFileSync, existsSync} from "fs"
const hikesFilePath = join(process.cwd(), process.env.DATA_FILE_HIKES)
const DB_MATKAD = "matkad"

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@node.ptafmcb.mongodb.net/?appName=Node`
const DB_HIKES = "hikes"
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
let client /*= new MongoClient//(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function testMongoDB() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
testMongoDB().catch(console.dir);
*/
async function getDatabaseCollection(collectionName) {
    if (!client) {
        client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });

        await client.connect()
    }
        console.log("ÜHENDUS ON LOODUD")
        const database = client.db(DB_MATKAD)
        return  database.collection(collectionName)

}

async function closeDatabaseConnection() {
    if (client) {
        await client.close()
        client = null
        console.log("ÜHENDUS ON SULETUD")
    }
}



let matkad = []

// Kontrolli, kas hikes.json fail eksisteerib, kui mitte, loo see algandmetega
if (!existsSync(hikesFilePath)) {
    writeFileSync(hikesFilePath, JSON.stringify(matkad, null, 2), "utf-8")
} else {
    // Kui fail eksisteerib, loe andmed sealt
    const hikes = JSON.parse(readFileSync(hikesFilePath, "utf-8"))
    matkad = hikes
}
async function storeAllHikes() {
    const hikesCollection = await getDatabaseCollection(DB_HIKES)
    // Kui matk on juba andmebaasis, uuenda seda, muidu lisa uus
    for (const matk of matkad) {
        await hikesCollection.updateOne(
            { id: matk.id },
            { $set: matk },
            { upsert: true }
        )
    }
    await closeDatabaseConnection()
}

async function loadAllHikes() {
    const hikesCollection = await getDatabaseCollection(DB_HIKES)  
    const hikesloaded = await hikesCollection.find().toArray()
    matkad = hikesloaded.map(el =>{
        return {...el, id: el._id.toString()}
    })
    console.log(matkad)
    await closeDatabaseConnection() 
    return matkad
}

export async function getAllHikes() {
    await loadAllHikes()
    return matkad
}

export async function getHikeById(hikeId) {
    await loadAllHikes()
    const matk = matkad.find(matk => {
        return matk.id === hikeId
    })
   
    return matk
}

export default matkad

export async function addRegistration(matkId, nimi, email) {
    
    if (!nimi || !email) {
        return false
    }
    const matk = await getHikeById(matkId)
    
    if (!matk) {
        return false
    }
    matk.osalejad.push({ nimi, email })
    await storeAllHikes()
    return matk
}                   

export async function addHike({nimetus, kirjeldus, pildiUrl}) {
    const newHike = {
        id: matkad.length + 1,
        nimetus,
        kirjeldus,
        pildiUrl:pildiUrl||"/assets/Hills.png",
        osalejad: []
    }   
    matkad.push(newHike)
    const hikesCollection = await getDatabaseCollection(DB_HIKES)
    console.log("hikesCollection")
    let newObject = await hikesCollection.insertOne(newHike)
    console.log("newObjectId")
    await closeDatabaseConnection()
    newHike.id = newObject.insertedId.toString()
    console.log(newHike)
    return newHike.id
}

export async function patchHikeById(hikeId, {nimetus, kirjeldus, osalejad}) {
    const matk = await getHikeById(hikeId)
    if (!matk) {
        throw new Error('Matka ei leitud')
    }
    if (nimetus !== undefined) {
        matk.nimetus = nimetus
    }
    if (kirjeldus !== undefined) {
        matk.kirjeldus = kirjeldus
    }
    if (osalejad !== undefined) {
        matk.osalejad = osalejad
    }
    await storeAllHikes()
    return matk
}