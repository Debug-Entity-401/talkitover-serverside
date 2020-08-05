'use strict';


class Model{
  constructor(schema){
    this.schema = schema;
  }
  /**
 * 
 * @param {string} newObject 
 */
  create(newObject){
    let newRecord = new this.schema(newObject);
    return newRecord.save();
  }
  /**
 * 
 * @param {string} status it will  get the status of the user 
 */
  read(status){
    return  status ? this.schema.find({status}) : this.schema.find({}); 
  }
  /**
   * 
   * @param {string} id 
   * @param {object} newRecord
   * it will update the user information in the database  
   */
  update(id,newRecord){
    return this.schema.findByIdAndUpdate({_id:id},newRecord,{new:true});
  }
  /**
 * 
 * @param {string} id it will delete the user record from the database 
 */
  delete(id){
    return this.schema.findByIdAndDelete({_id: id});

  }
  /**
 * 
 * @param {string} id it will delete the user record from the database 
 */
  readById(id){
    return this.schema.find({_id: id}); 
  }
  
}

module.exports = Model;
