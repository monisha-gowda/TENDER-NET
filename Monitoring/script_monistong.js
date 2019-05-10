/**
 * New script file
 *//*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language gover
 ning permissions and
 * limitations under the License.
 */
/* global getAssetRegistry getFactory emit */
/**
 * Submit an Enginnner's validation
 * @param {org.acme.contract.Engineer_Validate} engineerValidate - vali
 dation to be submitted
 * @transaction
 */

async function engineerValidate(engineerValidate){
  const contract = engineerValidate.engineerValidationData.contract;
  var flag = 1;
  if(!engineerValidate.engineerValidationData.validation){
    engineerValidate.engineerValidationData.validation = []
  }
    
     contract.engineerValidationStatus = "Not Validated";
  for(var i = 0; i<contract.data.length;i++){
      if(engineerValidate.engineerValidationData.validation[i] !== contract.data[i]){
        flag = 0;
        break;
      }
     
    }
        if(flag==1){
        contract.engineerValidationStatus = "Validated";       
        }
    
    const contractValidationRegistry = await getAssetRegistry('org.acme.contract.Contract');
    await contractValidationRegistry.update(contract);
}


/**
 * Submit a LabourRep's validation
 * @param {org.acme.contract.LabourRep_Validate} labourRepValidate - valdation to be submitted
 * @transaction
 */
 async function labourRepValidate(labourRepValidate){
  const contract = labourRepValidate.labourRepValidationData.contract;
  var flag = 1;
  if(!labourRepValidate.labourRepValidationData.validation){
    labourRepValidate.labourRepValidationData.validation = []
  }
    
     contract.labourRepValidationStatus = "Not Validated";
      for(var i = 0; i<contract.data.length;i++){
      if(labourRepValidate.labourRepValidationData.validation[i] !== contract.data[i]){
        flag = 0;
        break;
      }
     
    }
        if(flag){
        contract.labourRepValidationStatus = "Validated";       
        }
    
    const contractValidationRegistry = await getAssetRegistry('org.acme.contract.Contract');
    await contractValidationRegistry.update(contract);
}


/**
 * Submit a Supplier's validation
 * @param {org.acme.contract.Supplier_Validate} SupplierValidate - valdation to be submitted
 * @transaction
 */
 async function supplierValidate(supplierValidate){
  const contract = supplierValidate.supplierValidationData.contract;
  var flag = 1;
  if(!supplierValidate.supplierValidationData.validation){
    supplierValidate.supplierValidationData.validation = []
  }
    
     contract.supplierValidationStatus = "Not Validated";
     
      for(var i = 0; i<contract.data.length;i++){
      if(supplierValidate.supplierValidationData.validation[i] !== contract.data[i]){
        flag = 0;
        break;
      }
     
    }
        if(flag){
        contract.supplierValidationStatus = "Validated";       
        }
    
    const contractValidationRegistry = await getAssetRegistry('org.acme.contract.Contract');
    await contractValidationRegistry.update(contract);
}


/**
 * Submit a document
 * @param {org.acme.contract.SubmitDocument} submitDocument - document to be submitted
 * @transaction
 */
async function submitDocument(submitDocument){
    const document = submitDocument.document;
    if(document.contract.state !== 'OPEN'){
        throw new Error('Contract is closed');
    }
    if (!document.contract.documents) {
        document.contract.documents = [];
    }   
    document.contract.documents.push(submitDocument);
    document.contract.data.push("1");
    const documentRegistry = await getAssetRegistry('org.acme.contract.Document');
    await documentRegistry.update(document);
    const contractRegistry = await getAssetRegistry('org.acme.contract.Contract');
    await contractRegistry.update(document.contract);  
  
}
/**
 * Close the contract once the project is over
 * @param {org.acme.contract.CloseContract} closeContract - the contract
 * @transaction
 */
async function closeContract(closeContract){
    const contract = closeContract.contract;
    if(contract.state !== 'OPEN'){
        throw new Error('Closed Already');
    }
  
   if(contract.engineerValidationStatus == 'Validated' && contract.labourRepValidationStatus == 'Validated' &&       contract.supplierValidationStatus == 'Validated' && contract.validationState == 'OPEN_FOR_VALIDATION'){
        contract.validationState = 'VALIDATION_OVER';
        contract.state = 'CLOSED';
    }  
  
  else{
        //print a message 
        throw new Error('Validation Incomplete');
  }
    
    const contractAssetRegistry = await getAssetRegistry('org.acme.contract.Contract');
    await contractAssetRegistry.update(contract);
}
