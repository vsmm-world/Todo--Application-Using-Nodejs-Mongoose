const express= require('express');
const { copyFileSync } = require('fs');
const app= express();
const mongoose= require('mongoose');
const port = 3000;
const path = require('path');
const { title } = require('process');


app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));


async function conn(){
    const db = await mongoose.connect('mongodb://127.0.0.1:27017/trial')
     console.log("Connected to Mongodb");
 }
 
 conn().catch(err => console.log(err));
 

app.listen(port,()=>{
    console.log("Website is Running on : "+`http://localhost:${port}`);
})

const newSchema= new mongoose.Schema({

    name:String,
    age:Number

});

const Mod = mongoose.model('mod',newSchema);

const TodoSchema = new mongoose.Schema({

    title:String,
    task:String
})

const Todo = mongoose.model('Todo',TodoSchema);

const del = async ()=>{
    const dl= await Mod.deleteMany({});
    console.log(dl);
}

app.post('/api/todos',(req,res)=>{

   const title=req.body.title;
   const task=req.body.task;
   const obj =  {
    title:title,
    task:task
   } 

   const adding = new  Todo(obj);
   adding.save();
   console.log(obj);
   res.status(200).send("Added Sucessfully")
   
})

app.get('/clean',async(req, res)=>{

    const alldel = await Todo.deleteMany({});

    console.log("DATABASE IS CLEARED");
    console.log(alldel);
    res.send("All Deleted");
})

const data = async ()=>{

    const todo = await Todo.find({});
     return todo;
}

app.post('/', async (req,res)=>{
    const todo = await data();
    res.send(todo);
})

app.post('/api/del', async( req, res)=>{

    const {id} = req.body;

    const del = await Todo.deleteOne({_id:id});

    res.status('200').send("Deleted");

    console.log("Deleted")
    console.log(del);

})
app.post('/api/update',async(req,res)=>{
    const {id,ntitle,ntask}=req.body;

    console.log(id);

    const doc = await Todo.findOne({_id:id});
    console.log(doc);

    doc.title=ntitle;
    doc.task=ntask;
     const result = await doc.save();
     console.log(result);

     res.status(200).send("Updated SucsessFully");


})