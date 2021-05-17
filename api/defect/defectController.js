const defect = require('../defect/defectModel');

// Add Defect Request
addDefect = async(req,res) =>{
    try{
            const checkDefect = await defect.find({ "name"  :req.body.name });
            if(req.body.weight == "number"){
                if(checkDefect.length == 0){
                    const newDefect = new defect({
                        name: req.body.name,
                        weight: req.body.weight
                    });
                    await newDefect.save();
                    return res.send(newDefect);
                }
                else{
                    res.status(400).send('Defect Already Exists!');
                }
              }
              else
              {
                  res.status(400).json({"Message":"Defect weight must be an integers & Defect Weight Must be between 0 & 10"});
              }
    }
    catch(error){
        console.log(error);
        return res.status()
    }
};

// Change Defect Priority Level Admin Request
changeDefectPriorityLevelAdmin = async(req,res) =>{
    try{
        // Defect Validation
        const checkDefect = await defect.findOne({ "name" :req.body.name });
        if(checkDefect == null || checkDefect == undefined) return res.status(404).send('Invalid Defect');
        // Defect Weight Update
        if(req.body.weight)
        {
            if((typeof req.body.weight == "number") && Math.floor(req.body.weight) == req.body.weight && ( req.body.weight < 11 && req.body.weight >=0))
            {
                // Below Returns the Complete Object UnUpdated, from Database and Updates afterwards
                await defect.findOneAndUpdate({_id:checkDefect.id},{weight:req.body.weight});
                res.status(200).json({"Message":"Defect Weight Updated!"});
            }
            else
            {
                res.status(400).json({"Message":"Defect weight must be an integers & Defect Weight Must be between 0 & 10"});
            }
        }
        else
        {
            res.status(400).json({"Message":"Weight Not Found!"});
        }
      }
      catch(error){
        console.log(error);
        return res.status();
      }
}

// Get All Defects Request
getAllDefects = async(req,res) =>{
    try{
        // gets All Defects
        await defect.find()
        .then(defects => res.json(defects))
        .catch(err => res.status(404).json({ Message: 'No Defects found' }));
      }
      catch(error){
        console.log(error);
        return res.status();
      }
}

// Get Defect by Id Request
getDefectById = async(req,res) =>{
    try{
        // Get Defect By ID
        await defect.findById(req.query.id)
        .then(defectObj => res.json({"id":req.query.id,"name":defectObj.name,"weight":defectObj.weight}))
        .catch(err => res.status(404).json({ Message: 'No Defect found' }));
      }
      catch(error){
        console.log(error);
        return res.status();
      }
}

// Get Defect by Name Request
getDefectByName = async(req,res) =>{
    try{
        // Get Defect By Name
        await defect.findOne({"name": req.query.name})
        .then(defectObj => res.json({"id":defectObj.id,"name":req.query.name,"weight":defectObj.weight}))
        .catch(err => res.status(404).json({ Message: 'No Defect found' }));
      }
      catch(error){
        console.log(error);
        return res.status();
      }
};

// Change Defect Priority Level Admin Request
disableDefectAdmin = async(req,res) =>{
    try{
        // Disable Defect
        const checkDefect = await defect.findOne({ "name" :req.body.name });
        if(checkDefect == null || checkDefect == undefined) return res.status(404).send('Invalid Defect');
        // Defect Weight Update
        // Below Returns the Complete Object UnUpdated, from Database and Updates afterwards
        await defect.findOneAndUpdate({_id:checkDefect.id},{weight:0});
        res.status(200).json({"Message":"Defect Disabled!"});
      }
      catch(error){
        console.log(error);
        return res.status();
      }
}

module.exports = {
    addDefect: addDefect,
    changeDefectPriorityLevelAdmin:changeDefectPriorityLevelAdmin,
    getAllDefects:getAllDefects,
    getDefectById:getDefectById,
    getDefectByName:getDefectByName,
    disableDefectAdmin:disableDefectAdmin
};