const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const FoodModel= require("./models/Food")

app.use(express.json())
app.use(cors())

mongoose.connect(`mongodb+srv://Ujjwal:Ujjwal16mongodb@cluster0.acd6jyn.mongodb.net/Food?retryWrites=true&w=majority`,{
    useNewUrlParser: true,
});
app.post('/insert',async(req,res)=>{
    const foodName = req.body.foodName
    const days = req.body.days
    const food = new FoodModel({foodName : foodName, daysSinceIAte : days });
                                

    try{
        await food.save();
    }catch(err){
        console.log(err)
    }
});
//----------------------------------------------------------
app.get("/read",async(request,response)=>{
   
   try{
    const users = await FoodModel.find({});
    response.status(200).json(users);
   }catch(error){response.status(404).json({message:error.message})}
});

//----------------------------------------------------------
// app.put("/update/:id",async(req,res)=>{
//     const newFoodName = req.body.newFoodName;
//     const newDays = req.body.newDays
//     const id = req.params.id;
//     // const days = req.body.days
    
//     try{
//       const updatedFood  = await FoodModel.findById(id);
//         if(updatedFood){
//             updatedFood.foodName = newFoodName;
//             updatedFood.daysSinceIAte = newDays
//            const food = new FoodModel({foodName : updatedFood, daysSinceIAte:updatedFood});
//         //    const result = await food.save()
//            await food.save();
//             res.send("update");

//         }else{
//             res.send("data not found")
//         }
//         await FoodModel.findById(id,(err,updatedFood)=>{
//         //  await FoodModel.findByIdAndUpdate((id),(err, updatedFood)=>{
//             updatedFood.foodName = newFoodName;
//             updatedFood.daysSinceIAte = newDays
//             updatedFood.save();
//             res.send("update");

//         });

//     }catch(err){
//         console.log(err );

//     }
// });
app.put("/update/:id",async(req,res)=>{
    if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  FoodModel.findByIdAndUpdate(id, req.body, { useFindAndModify: true })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Food with id=${id}. Maybe Food was not found!`
        });
      } else res.send({ message: "Food was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Food with id=" + id
      });
    });
});

app.delete("/delete/:id", async(req,res)=>{
    const id = req.params.id;
    await FoodModel.findByIdAndRemove(id).exec();
    res.send("deleted");
});
//----------------------------------------------------------
app.listen(5001,()=>{
    console.log("server running on port 5001...");
})