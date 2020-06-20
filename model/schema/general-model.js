'use strict';
class Model{
  constructor(schema){
    this.schema = schema;
  }
  create(newObject){
    let newRecord = new this.schema(newObject);
    return newRecord.save();
  }
  read(status){
    return  status ? this.schema.find({status}) : this.schema.find({}); 
  }
  update(id,newRecord){
    return this.schema.findByIdAndUpdate({_id:id},newRecord,{new:true});
  }
  delete(id){
    return this.schema.findByIdAndDelete({_id: id});

  }
  readById(id){
    return this.schema.find({_id: id}); 
  }
}

module.exports = Model;